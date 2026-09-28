from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.project import Project
from app.schemas.alert import ChatRequest, ChatResponse
from app.rag.assistant_engine import generate_rag_response, query_ollama_llm

router = APIRouter(prefix="/assistant", tags=["AI Assistant (RAG)"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    last_msg = req.messages[-1].content if req.messages else "Hello"
    
    project_data = None
    if req.project_id:
        p = db.query(Project).filter(Project.id == req.project_id).first()
        if p:
            project_data = {
                "id": p.id,
                "code": p.code,
                "name": p.name,
                "risk_score": p.risk_score,
                "risk_level": p.risk_level,
                "physical_progress": p.physical_progress,
                "expected_progress": p.expected_progress,
                "delay_probability": p.delay_probability,
                "cost_overrun_probability": p.cost_overrun_probability,
                "land_acquisition_pct": p.land_acquisition_pct,
                "contractor_rating": p.contractor_rating
            }
    
    all_projects = [
        {"id": p.id, "name": p.name, "risk_level": p.risk_level, "risk_score": p.risk_score}
        for p in db.query(Project).all()
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
