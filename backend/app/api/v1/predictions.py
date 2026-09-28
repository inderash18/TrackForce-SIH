from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.project import Project
from app.models.alert import PredictionLog
from app.ml.inference import predict_project_risk, compute_engineered_features

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.get("/{project_id}")
def get_prediction_for_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(or_(Project.id == project_id, Project.code == project_id)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project {project_id} not found")
    
    project_dict = {
        "id": project.id,
        "name": project.name,
        "code": project.code,
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
    
    # Return structured prediction data
    return {
        "project_id": project.id,
        "project_name": project.name,
        "model_version": "v2.4-xgboost-ensemble",
        "risk_score": prediction["risk_score"],
        "risk_level": prediction["risk_level"],
        "delay_probability": prediction["delay_probability"],
        "cost_overrun_probability": prediction["cost_overrun_probability"],
        "predicted_delay_months": prediction["predicted_delay_months"],
        "predicted_final_cost": prediction["predicted_final_cost"],
        "cost_risk": prediction["cost_risk"],
        "shap_drivers": prediction["shap_drivers"],
        "recommendations": project.recommendations or []
    }
