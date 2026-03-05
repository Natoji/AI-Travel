from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Trip
from models.trip import TripCreate, TripUpdate
from routers.auth import get_current_user
from services.gemini_service import generate_itinerary
from datetime import datetime
import json

router = APIRouter(prefix='/trips', tags=['trips'])

def trip_to_dict(trip) -> dict:
    return {
        'id': str(trip.id),
        'user_id': str(trip.user_id),
        'destination': trip.destination,
        'days': trip.days,
        'budget': trip.budget,
        'itinerary': json.loads(trip.itinerary) if trip.itinerary else None,
        'is_public': trip.is_public,
        'created_at': trip.created_at
    }

@router.post('/')
def create_trip(trip_data: TripCreate, db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
    try:
        itinerary = generate_itinerary(
            trip_data.destination, trip_data.days,
            trip_data.budget, trip_data.travel_style, trip_data.people, trip_data.departure_city
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    new_trip = Trip(
        user_id=current_user.id,
        destination=trip_data.destination,
        days=trip_data.days,
        budget=trip_data.budget,
        travel_style=','.join(trip_data.travel_style),
        people=trip_data.people,
        itinerary=json.dumps(itinerary, ensure_ascii=False),
        is_public=False,
        created_at=datetime.utcnow()
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return trip_to_dict(new_trip)

@router.get('/my-trips')
def get_my_trips(db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
    trips = db.query(Trip).filter(Trip.user_id == current_user.id)\
            .order_by(Trip.created_at.desc()).all()
    return [trip_to_dict(t) for t in trips]

@router.get('/{trip_id}')
def get_trip(trip_id: str, db: Session = Depends(get_db),
            current_user = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == int(trip_id)).first()
    if not trip:
        raise HTTPException(status_code=404, detail='Khong tim thay')
    return trip_to_dict(trip)

@router.put('/{trip_id}')
def update_trip(trip_id: str, update_data: TripUpdate,
                db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == int(trip_id)).first()
    if not trip:
        raise HTTPException(status_code=404, detail='Khong tim thay')
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Khong co quyen')
    if update_data.itinerary:
        trip.itinerary = json.dumps(update_data.itinerary, ensure_ascii=False)
    if update_data.is_public is not None:
        trip.is_public = update_data.is_public
    if update_data.days is not None:    
        trip.days = update_data.days 
    if update_data.budget is not None:    
        trip.budget = update_data.budget
    db.commit()
    db.refresh(trip)
    return trip_to_dict(trip)

@router.delete('/{trip_id}')
def delete_trip(trip_id: str, db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):
    trip = db.query(Trip).filter(Trip.id == int(trip_id)).first()
    if not trip:
        raise HTTPException(status_code=404, detail='Khong tim thay')
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Khong co quyen')
    db.delete(trip)
    db.commit()
    return {'message': 'Da xoa thanh cong'}
