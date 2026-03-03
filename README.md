# AI Travel Planner

Ứng dụng lập kế hoạch du lịch bằng AI gồm:
- `frontend`: React + Vite
- `backend`: FastAPI + SQLite + Gemini API

## Tính năng chính

- Đăng ký/đăng nhập bằng JWT
- Tạo lịch trình du lịch bằng AI theo:
  - điểm đi, điểm đến
  - số ngày, số người
  - ngân sách
  - phong cách du lịch
- Xem danh sách chuyến đi và chi tiết lịch trình

## Cấu trúc thư mục

```text
ai-travel-planner/
├─ backend/
├─ frontend/
├─ .gitignore
└─ README.md
```

## Yêu cầu

- Python 3.10+
- Node.js 18+ (khuyến nghị Node.js 20+)

## Thiết lập backend

```bash
cd backend
python -m venv ../venv
../venv/Scripts/activate
pip install -r requirements.txt
```

Tạo file `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Chạy API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend mặc định chạy tại: `http://localhost:8000`

## Thiết lập frontend

```bash
cd frontend
npm install
```

Tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Chạy frontend:

```bash
npm run dev
```

Frontend mặc định chạy tại: `http://localhost:5173`

## Script thường dùng

Frontend:
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

Backend:
- `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## Ghi chú

- Database SQLite sẽ tự tạo tại `backend/travel_planner.db`.
- CORS backend đã cho phép local frontend (`localhost:5173`) theo mặc định.
- Nếu AI không trả lịch trình, kiểm tra `GEMINI_API_KEY` và log backend.

## README thành phần

- Frontend chi tiết: [frontend/README.md](./frontend/README.md)
