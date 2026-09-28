# Step-by-Step Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying **PAIMANA Sentinel AI** to free-tier cloud hosting:
- **Backend (FastAPI + Python 3.12)** ➔ **Render**
- **Frontend (React 19 + Vite + Tailwind v4)** ➔ **Vercel**

---

## Architecture Overview

```
[ Citizen / Official Browser ]
             │
      ┌──────┴────────────────────────┐
      ▼                               ▼
[ Vercel (Frontend) ]       [ Render (Backend) ]
https://paimana.vercel.app  https://paimana-api.onrender.com
      │                               ▲
      └────── REST API Calls ─────────┘
        (VITE_API_BASE_URL)
```

---

## Step 1: Deploy Backend to Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository (`TrackForce-SIH`).
4. Configure the Web Service settings:
   - **Name**: `paimana-backend` (or any custom name)
   - **Region**: Closest to your users (e.g. *Singapore* or *Frankfurt*)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free** ($0/month)
5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |---|---|---|
   | `PYTHON_VERSION` | `3.12.10` | Matches project runtime |
   | `APP_ENV` | `production` | Production mode |
   | `DATABASE_URL` | `sqlite:///./paimana_sentinel.db` | Auto-seeded SQLite database |
   | `JWT_SECRET` | *(Generate a secure random string)* | E.g. `paimana-prod-secret-key-2026` |
   | `JWT_REFRESH_SECRET` | *(Generate a secure random string)* | E.g. `paimana-refresh-secret-2026` |
6. Click **Create Web Service**.
7. Once deployed, Render will provide a URL like:
   `https://paimana-backend-xxxx.onrender.com`
8. Verify it works by opening:
   `https://paimana-backend-xxxx.onrender.com/health` (should return `{"status":"healthy"}`)
   `https://paimana-backend-xxxx.onrender.com/docs` (Swagger UI API documentation)

---

## Step 2: Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **Add New…** ➔ **Project**.
3. Import your GitHub repository (`TrackForce-SIH`).
4. In the project configuration:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add your Render API endpoint:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://paimana-backend-xxxx.onrender.com/api/v1` |
   *(Replace with your actual Render URL from Step 1)*
6. Click **Deploy**.
7. Vercel will build the frontend in ~20 seconds and assign your live production domain:
   `https://trackforce-sih.vercel.app` (or custom name).

---

## Step 3: Verify the Live Deployment

1. Open your Vercel URL in your browser.
2. Sign in using any demo account (e.g. `ananya.sengupta@railways.gov.in`).
3. Verify that:
   - Dashboard loads live project counts from the Render backend.
   - Project Details, Milestones, and Risks & Actions display with full styling.
   - What-If simulations and reports work cleanly.

---

## Summary of Configuration Files Created

- [`vercel.json`](file:///s:/TrackForce-SIH/vercel.json): Handles SPA route rewrites to `/index.html` and long-term asset caching.
- [`render.yaml`](file:///s:/TrackForce-SIH/render.yaml): Blueprint configuration for one-click Render deployment.
