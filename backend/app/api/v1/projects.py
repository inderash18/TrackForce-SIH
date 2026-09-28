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
