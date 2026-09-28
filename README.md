# PAIMANA Sentinel AI

> **AI-Powered Predictive Analytics & Early Warning System for Infrastructure Monitoring**
> Developed for the Ministry of Statistics and Programme Implementation (MoSPI) & PAIMANA Ecosystem.

---

## Overview
**PAIMANA Sentinel AI** is an enterprise-grade AI intelligence layer designed to proactively identify, quantify, and prevent schedule slippages and cost escalations across India's multi-billion dollar national infrastructure portfolio.

### Key Capabilities
- **Predictive Risk & Delay Engine**: Powered by LightGBM and XGBoost trained on MoSPI Flash Report data.
- **Explainable AI (SHAP)**: Defensible, transparent feature attribution explaining exact root causes for every risk score.
- **What-If Scenario Simulator**: Interactive parameter perturbation (Land Acquisition %, Contractor Velocity, Clearance Approvals) with side-by-side Before/After risk deltas.
- **Spatial Map Intelligence**: OpenStreetMap & Leaflet interactive GIS layers mapping projects by geographical risk severity.
- **Strict Knowledge-Grounded RAG Assistant**: Qwen LLM connector via Ollama providing conversational query resolution with zero hallucination.
- **Role-Based Access Control (RBAC)**: Fine-grained security for `SUPER_ADMIN`, `MOSPI_ADMIN`, `MINISTRY_OFFICER`, and `ANALYST`.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Leaflet, Lucide Icons, Modern Enterprise Design System (Deep Navy & Royal Blue).
- **Backend**: FastAPI, Python 3.12, Pydantic V2, SQLAlchemy 2.0, Alembic, Celery, Redis.
- **Database & Vector Store**: PostgreSQL 16 with pgvector.
- **Machine Learning & XAI**: LightGBM, XGBoost, Scikit-Learn, SHAP.
- **Containerization & Ops**: Docker, Docker Compose, Nginx, Prometheus, Grafana.

---

## Quick Start (Docker Compose)
```bash
# 1. Clone the repository and navigate to root
cd TrackForce-SIH

# 2. Copy environment configuration
cp .env.example .env

# 3. Start all services
docker compose up -d

# 4. Open in browser
# Frontend: http://localhost:80
# FastAPI Swagger Docs: http://localhost:8000/docs
```

---

## Local Development (Without Docker)

### Backend:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m app.main
```

### Frontend:
```bash
npm install
npm run dev
```

---

## License & Compliance
This software is designed in compliance with the Ministry of Statistics and Programme Implementation (MoSPI) Central Upload Format (CUF) guidelines and PM GatiShakti National Master Plan data security standards.
