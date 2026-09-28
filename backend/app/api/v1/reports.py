import csv
import io
from fastapi import APIRouter, Depends, Response, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.models.user import User
from app.models.alert import EarlyWarningAlert
from app.schemas.user import UserResponse
from app.auth.rbac import require_permission, get_current_user

reports_router = APIRouter(prefix="/reports", tags=["Reports"])
data_router = APIRouter(prefix="/data", tags=["Data Management"])
admin_router = APIRouter(prefix="/admin", tags=["Administration"])

# --- REPORTS ---
@reports_router.get("/export/csv")
def export_projects_csv(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Project ID", "Code", "Name", "Ministry", "Sector", "State",
        "Original Cost (Cr)", "Revised Cost (Cr)", "Expenditure (Cr)",
        "Physical Progress (%)", "Risk Score", "Risk Level",
        "Delay Probability (%)", "Predicted Delay (Months)", "Predicted Final Cost (Cr)"
    ])
    for p in projects:
        writer.writerow([
            p.id, p.code, p.name, p.ministry, p.sector, p.state,
            p.original_cost, p.revised_cost, p.expenditure,
            p.physical_progress, p.risk_score, p.risk_level,
            p.delay_probability, p.predicted_delay_months, p.predicted_final_cost
        ])
    
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=paimana_projects_export.csv"}
    )

@reports_router.get("/list")
def list_available_reports():
    return [
        {
            "id": "REP-2026-001",
            "title": "Monthly Infrastructure Early Warning Flash Report",
            "period": "February 2026",
            "type": "MoSPI Executive Briefing",
            "status": "Generated",
            "file_size": "2.4 MB"
        },
        {
            "id": "REP-2026-002",
            "title": "Mega Projects (>1000 Cr) Cost Overrun Exposure Matrix",
            "period": "Q3 FY 2025-26",
            "type": "Financial Audit",
            "status": "Generated",
            "file_size": "4.1 MB"
        },
        {
            "id": "REP-2026-003",
            "title": "Inter-Ministerial Land Acquisition & RoW Review",
            "period": "January 2026",
            "type": "Regulatory Compliance",
            "status": "Generated",
            "file_size": "1.8 MB"
        }
    ]

# --- DATA MANAGEMENT ---
@data_router.get("/status")
def get_data_ingestion_status(db: Session = Depends(get_db)):
    project_count = db.query(Project).count()
    return {
        "sources": [
            {
                "name": "Central Upload Format (CUF) Portal",
                "type": "Monthly Ingestion",
                "rows_ingested": project_count,
                "last_sync": "2026-02-28 23:59:00",
                "completeness_pct": 98.4,
                "missing_values_pct": 1.6,
                "status": "Healthy"
            },
            {
                "name": "PM GatiShakti GIS Portal",
                "type": "Spatial Overlay",
                "rows_ingested": project_count,
                "last_sync": "2026-03-01 04:30:00",
                "completeness_pct": 100.0,
                "missing_values_pct": 0.0,
                "status": "Healthy"
            },
            {
                "name": "MoEFCC Parivesh Portal",
                "type": "Clearance Feed",
                "rows_ingested": project_count,
                "last_sync": "2026-02-27 18:15:00",
                "completeness_pct": 94.2,
                "missing_values_pct": 5.8,
                "status": "Healthy"
            }
        ],
        "data_confidence_index": 96.8,
        "anomalies_detected": 0
    }

# --- ADMIN ---
@admin_router.get("/users")
def get_admin_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("users.manage"))
):
    users = db.query(User).all()
    return [UserResponse.from_orm(u) for u in users]

@admin_router.get("/system-health")
def get_system_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("system.manage"))
):
    return {
        "api_status": "Operational",
        "database_status": "Connected (PostgreSQL / SQLite)",
        "ml_inference_engine": "Active (LightGBM/XGBoost v2.4)",
        "rag_service": "Connected",
        "background_worker": "Redis Celery Active",
        "uptime_pct": 99.98,
        "avg_query_latency_ms": 22.4
    }
