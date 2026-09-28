from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.db.session import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.alert import ChatRequest, ChatResponse
from app.rag.assistant_engine import generate_rag_response
from app.auth.rbac import get_optional_current_user, is_national_oversight_user, get_user_authorized_ministries, enforce_user_ministry_access
from sqlalchemy import or_

router = APIRouter(prefix="/assistant", tags=["AI Assistant (RAG)"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    req: ChatRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    last_msg = req.messages[-1].content if req.messages else "Hello"
    
    project_data = None
    if req.project_id:
        p = db.query(Project).filter(Project.id == req.project_id).first()
        if p and (not current_user or enforce_user_ministry_access(current_user, p.ministry)):
            project_data = {
                "id": p.id,
                "code": p.code,
                "name": p.name,
                "ministry": p.ministry,
                "risk_score": p.risk_score,
                "risk_level": p.risk_level,
                "physical_progress": p.physical_progress,
                "expected_progress": p.expected_progress,
                "delay_probability": p.delay_probability,
                "cost_overrun_probability": p.cost_overrun_probability,
                "land_acquisition_pct": p.land_acquisition_pct,
                "contractor_rating": p.contractor_rating
            }
    
    query = db.query(Project)
    if current_user and not is_national_oversight_user(current_user):
        user_mins = get_user_authorized_ministries(current_user)
        if user_mins and user_mins != ["ALL"]:
            ministry_filters = [Project.ministry.ilike(f"%{m}%") for m in user_mins]
            query = query.filter(or_(*ministry_filters))

    all_projects = [
        {"id": p.id, "name": p.name, "ministry": p.ministry, "risk_level": p.risk_level, "risk_score": p.risk_score}
        for p in query.all()
    ]

    rag_result = generate_rag_response(
        query=last_msg,
        project_data=project_data,
        all_projects=all_projects
    )

    return ChatResponse(
        reply=rag_result["reply"],
        citations=rag_result["citations"],
        suggested_questions=rag_result["suggested_questions"]
    )
