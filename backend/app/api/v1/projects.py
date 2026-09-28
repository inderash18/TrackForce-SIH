from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.core.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectBase, ProjectDetail, PaginatedProjects
from app.auth.rbac import get_optional_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=PaginatedProjects)
def list_projects(
    search: Optional[str] = None,
    ministry: Optional[str] = None,
    sector: Optional[str] = None,
    state: Optional[str] = None,
    risk_level: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = "risk_score",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(Project)

    if search:
        search_filter = or_(
            Project.name.ilike(f"%{search}%"),
            Project.code.ilike(f"%{search}%"),
            Project.implementing_agency.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    if ministry and ministry != "All Ministries":
        query = query.filter(Project.ministry == ministry)
    if sector and sector != "All Sectors":
        query = query.filter(Project.sector == sector)
    if state and state != "All States":
        query = query.filter(Project.state.ilike(f"%{state}%"))
    if risk_level and risk_level != "All":
        query = query.filter(Project.risk_level == risk_level)
    if status and status != "All":
        query = query.filter(Project.status == status)

    # Sorting
    sort_column = getattr(Project, sort_by, Project.risk_score)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    def _val_proj(p):
        return ProjectBase.model_validate(p) if hasattr(ProjectBase, "model_validate") else ProjectBase.from_orm(p)

    return PaginatedProjects(
        items=[_val_proj(p) for p in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{project_id}", response_model=ProjectDetail)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(or_(Project.id == project_id, Project.code == project_id)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project {project_id} not found")
    return ProjectDetail.model_validate(project) if hasattr(ProjectDetail, "model_validate") else ProjectDetail.from_orm(project)

@router.post("", response_model=ProjectDetail, status_code=status.HTTP_201_CREATED)
def create_project(payload: dict, db: Session = Depends(get_db)):
    from app.ml.inference import predict_project_risk
    from app.models.alert import EarlyWarningAlert
    import uuid

    code = payload.get("code") or f"PRJ-{uuid.uuid4().hex[:6].upper()}"
    existing = db.query(Project).filter(Project.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Project with code {code} already exists")

    prediction = predict_project_risk(payload)

    project_id = payload.get("id") or f"PRJ-{uuid.uuid4().hex[:8].upper()}"
    new_project = Project(
        id=project_id,
        name=payload.get("name", "Untitled Infrastructure Project"),
        code=code,
        ministry=payload.get("ministry", "Ministry of Road Transport and Highways"),
        sector=payload.get("sector", "Roads & Highways"),
        state=payload.get("state", "National"),
        district=payload.get("district", "Multiple"),
        implementing_agency=payload.get("implementing_agency", "NHAI"),
        project_category=payload.get("project_category", "Major Project (>150 Cr)"),
        original_cost=float(payload.get("original_cost", 1000.0)),
        revised_cost=float(payload.get("revised_cost", payload.get("original_cost", 1000.0))),
        expenditure=float(payload.get("expenditure", 0.0)),
        original_completion=str(payload.get("original_completion", "2027-12-31")),
        revised_completion=str(payload.get("revised_completion", "2027-12-31")),
        predicted_completion=str(payload.get("predicted_completion", "2028-06-30")),
        physical_progress=float(payload.get("physical_progress", 0.0)),
        financial_progress=float(payload.get("financial_progress", 0.0)),
        expected_progress=float(payload.get("expected_progress", 10.0)),
        progress_velocity=float(payload.get("progress_velocity", 1.0)),
        risk_score=prediction["risk_score"],
        risk_level=prediction["risk_level"],
        delay_probability=prediction["delay_probability"],
        cost_overrun_probability=prediction["cost_overrun_probability"],
        predicted_delay_months=prediction["predicted_delay_months"],
        predicted_final_cost=prediction["predicted_final_cost"],
        cost_risk=prediction["cost_risk"],
        status=payload.get("status", "In Progress"),
        latitude=float(payload.get("latitude", 20.5937)) if payload.get("latitude") else None,
        longitude=float(payload.get("longitude", 78.9629)) if payload.get("longitude") else None,
        contractor_rating=float(payload.get("contractor_rating", 4.0)),
        land_acquisition_pct=float(payload.get("land_acquisition_pct", 100.0)),
        forest_clearance_status=payload.get("forest_clearance_status", "Approved"),
        environment_clearance_status=payload.get("environment_clearance_status", "Approved"),
        shap_drivers=prediction.get("shap_drivers", []),
        recommendations=payload.get("recommendations", []),
        monthly_trends=payload.get("monthly_trends", []),
        milestones=payload.get("milestones", [])
    )

    db.add(new_project)

    # If high or critical risk, automatically generate an Early Warning Alert
    if prediction["risk_level"] in ["Critical", "High"]:
        alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
        alert = EarlyWarningAlert(
            id=alert_id,
            project_id=project_id,
            project_name=new_project.name,
            ministry=new_project.ministry,
            sector=new_project.sector,
            warning_type="Predictive Risk Surveillance Alert",
            severity=prediction["risk_level"],
            previous_risk=0.0,
            new_risk=prediction["risk_score"],
            reason=f"Automated risk assessment flagged {prediction['risk_level']} risk (Score: {prediction['risk_score']}/100) due to milestone variance and progress gap.",
            recommended_action=f"Deploy technical nodal intervention desk and review land/contractor bottlenecks.",
            responsible_team=f"{new_project.implementing_agency} Monitoring Unit",
            status="Active"
        )
        db.add(alert)

    db.commit()
    db.refresh(new_project)
    return ProjectDetail.model_validate(new_project) if hasattr(ProjectDetail, "model_validate") else ProjectDetail.from_orm(new_project)

@router.patch("/{project_id}", response_model=ProjectDetail)
def update_project(project_id: str, payload: dict, db: Session = Depends(get_db)):
    from app.ml.inference import predict_project_risk

    project = db.query(Project).filter(or_(Project.id == project_id, Project.code == project_id)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project {project_id} not found")

    for key, value in payload.items():
        if hasattr(project, key) and value is not None and key not in ["id", "created_at"]:
            setattr(project, key, value)

    # Re-run ML risk assessment
    project_dict = {
        "original_cost": project.original_cost,
        "revised_cost": project.revised_cost,
        "expenditure": project.expenditure,
        "physical_progress": project.physical_progress,
        "expected_progress": project.expected_progress,
        "contractor_rating": project.contractor_rating,
        "land_acquisition_pct": project.land_acquisition_pct,
        "forest_clearance_status": project.forest_clearance_status,
        "environment_clearance_status": project.environment_clearance_status
    }
    prediction = predict_project_risk(project_dict)
    project.risk_score = prediction["risk_score"]
    project.risk_level = prediction["risk_level"]
    project.delay_probability = prediction["delay_probability"]
    project.cost_overrun_probability = prediction["cost_overrun_probability"]
    project.predicted_delay_months = prediction["predicted_delay_months"]
    project.predicted_final_cost = prediction["predicted_final_cost"]
    project.cost_risk = prediction["cost_risk"]
    project.shap_drivers = prediction["shap_drivers"]

    db.commit()
    db.refresh(project)
    return ProjectDetail.model_validate(project) if hasattr(ProjectDetail, "model_validate") else ProjectDetail.from_orm(project)

