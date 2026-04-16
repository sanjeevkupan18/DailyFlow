# DailyFlow — Daily Task Tracker & Performance Analytics

A full-stack MERN application to set daily tasks, track completion, and visualise performance with charts and heatmaps.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Zustand, React Query
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth**: JWT (access + refresh tokens), HttpOnly cookies

---

## Quick Start

### 1. Install all dependencies
```bash
npm run install:all
```

### 2. Configure environment variables

**Server** — copy and fill in `server/.env.example` → `server/.env`:
```
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/dailyflow
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://127.0.0.1:5173
ALLOW_VERCEL_PREVIEWS=false
```

**Client** — copy `client/.env.example` → `client/.env`:
```
VITE_API_BASE_URL=http://localhost:5001/api
```

### 3. Run in development
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend:  http://localhost:5001

---

## Features

- ✅ **Daily Task Board** — add, edit, delete, reorder tasks with priority & categories
- ☑️ **One-click completion** — tick tasks with animated checkbox, auto-calculates score
- 📊 **Performance Score** — priority-weighted score (urgent tasks count more)
- 📈 **Analytics**: Bar, Line, Area, Radar charts + GitHub-style heatmap
- 🔥 **Streak tracking** — consecutive active days
- 💡 **Auto Observations** — rule-based insights about your patterns
- 🔐 **JWT Auth** — silent token refresh, persistent login

---

## Project Structure
```
dailyflow/
├── server/       Express API + MongoDB models
└── client/       React frontend (Vite + Tailwind)
```

---

## Deployment

| Service | Platform |
|---|---|
| Backend | Render / Railway |
| Frontend | Vercel |
| Database | MongoDB Atlas (free M0 tier) |

Set `VITE_API_BASE_URL` to your production API URL on Vercel.

For production with Vercel + Render:
- Set `CLIENT_URL` to your main Vercel production URL
- Set `CLIENT_URLS` to any extra allowed frontend URLs, comma-separated
- Set `ALLOW_VERCEL_PREVIEWS=true` on Render if you want Vercel preview deployments to access the API
# DailyFlow
