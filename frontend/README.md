# AI Travel Planner Frontend

React + Vite frontend for the AI Travel Planner app.

## Features

- User register/login and token-based auth
- Create trip plans with AI (destination, budget, style, people, dates)
- View trip list and trip details
- Auto-attach JWT token on API requests
- Auto-logout on `401 Unauthorized`

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS

## Requirements

- Node.js 18+ (Node.js 20+ recommended)
- Backend API running from this repository (`../backend`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:8000
```

3. Start development server:

```bash
npm run dev
```

Default frontend URL: `http://localhost:5173`

## Available Scripts

- `npm run dev` - run dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Backend Quick Start (from repo root)

```bash
cd backend
python -m venv ../venv
../venv/Scripts/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

Run API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Notes

- The backend uses SQLite and auto-creates `backend/travel_planner.db`.
- CORS allows local frontend origins by default (`localhost:5173`).
- If AI itinerary generation fails, verify `GEMINI_API_KEY` and backend logs.
