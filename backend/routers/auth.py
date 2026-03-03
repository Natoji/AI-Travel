from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db, User
from models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from services.auth_service import hash_password, verify_password, create_access_token, decode_token
from datetime import datetime

router = APIRouter(prefix='/auth', tags=['auth'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/login')

def get_current_user(token: str = Depends(oauth2_scheme),
                    db: Session = Depends(get_db)):
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail='Token khong hop le')
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail='Khong tim thay user')
    return user

@router.post('/register', response_model=TokenResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail='Email da duoc su dung')
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password),
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_access_token({'sub': str(new_user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=str(new_user.id), name=new_user.name,
                        email=new_user.email, created_at=new_user.created_at)
    )

@router.post('/login', response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail='Email hoac mat khau sai')
    token = create_access_token({'sub': str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=str(user.id), name=user.name,
                        email=user.email, created_at=user.created_at)
    )

@router.get('/me', response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return UserResponse(id=str(current_user.id), name=current_user.name,
                        email=current_user.email, created_at=current_user.created_at)
