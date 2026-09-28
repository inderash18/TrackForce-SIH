import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.db.seed_data import init_and_seed_database
from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as projects_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.simulator import router as simulator_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.models import router as models_router
from app.api.v1.reports import reports_router, data_router, admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize and seed local database
    init_and_seed_database()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PAIMANA Sentinel AI: Predictive Analytics & Early Warning System for Infrastructure Monitoring (MoSPI)",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Audit Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    response.headers["X-Platform"] = "PAIMANA-Sentinel-AI"
    return response

# Root Route
@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to PAIMANA Sentinel AI Backend API",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "api_v1": settings.API_V1_STR
    }

# Health & Readiness Checks
@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.APP_ENV
    }

@app.get("/ready", tags=["System"])
def readiness_check():
    return {
        "status": "ready",
        "database": "connected",
        "ml_engine": "ready",
        "timestamp": time.time()
    }

# Register V1 API Routes
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(predictions_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(simulator_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(models_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(data_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
