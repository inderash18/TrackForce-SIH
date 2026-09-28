# PAIMANA Sentinel AI — Deployment Guide

## 1. Quick Start with Docker Compose
To launch the complete multi-service stack:
```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Start all services in detached mode
docker compose up -d

# 3. Verify container status
docker compose ps
```

Services exposed:
- **Frontend UI**: `http://localhost:80` (or `http://localhost:5173` in local dev)
- **FastAPI Backend**: `http://localhost:8000`
- **Swagger Interactive API Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

## 2. Local Development (Without Docker)

### Backend:
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

### Frontend:
```powershell
npm install
npm run dev
```
