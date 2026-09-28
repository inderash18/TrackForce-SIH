from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.project import Project
from app.schemas.alert import SimulationRequest, SimulationResult
from app.ml.inference import predict_project_risk

router = APIRouter(prefix="/simulator", tags=["What-If Simulator"])

@router.post("/simulate", response_model=SimulationResult)
def run_what_if_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    project = db.query(Project).filter(or_(Project.id == req.project_id, Project.code == req.project_id)).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Project {req.project_id} not found")

    # Baseline data
    baseline_dict = {
        "id": project.id,
        "name": project.name,
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
    baseline_prediction = predict_project_risk(baseline_dict)

    # Simulated data with parameter overrides
    simulated_dict = dict(baseline_dict)
    if req.physical_progress is not None:
        simulated_dict["physical_progress"] = req.physical_progress
    if req.land_acquisition_pct is not None:
        simulated_dict["land_acquisition_pct"] = req.land_acquisition_pct
    if req.contractor_performance is not None:
        simulated_dict["contractor_rating"] = req.contractor_performance
    if req.clearance_status is not None:
        simulated_dict["forest_clearance_status"] = req.clearance_status
        simulated_dict["environment_clearance_status"] = req.clearance_status
    if req.monthly_progress_rate is not None:
        # Boost velocity and calculate forward progress
        simulated_dict["physical_progress"] = min(simulated_dict["physical_progress"] + req.monthly_progress_rate * 3, 100.0)

    simulated_prediction = predict_project_risk(simulated_dict)

    risk_delta = round(simulated_prediction["risk_score"] - baseline_prediction["risk_score"], 1)
    delay_delta = round(simulated_prediction["delay_probability"] - baseline_prediction["delay_probability"], 1)
    cost_delta = round(simulated_prediction["predicted_final_cost"] - baseline_prediction["predicted_final_cost"], 1)

    insights = []
    if risk_delta < 0:
        insights.append(f"Risk score decreases by {abs(risk_delta)} points under the simulated scenario.")
    elif risk_delta > 0:
        insights.append(f"Caution: Risk score increases by {risk_delta} points under reduced intervention.")
    else:
        insights.append("Project risk parameters remain stable under current settings.")

    if req.land_acquisition_pct and req.land_acquisition_pct > baseline_dict["land_acquisition_pct"]:
        insights.append(f"Accelerating land acquisition to {req.land_acquisition_pct}% directly reduces right-of-way litigation bottlenecks.")

    if req.contractor_performance and req.contractor_performance > baseline_dict["contractor_rating"]:
        insights.append(f"Upgrading contractor execution rating to {req.contractor_performance}/5.0 shortens predicted delay by approx {max(baseline_prediction['predicted_delay_months'] - simulated_prediction['predicted_delay_months'], 0)} months.")

    return SimulationResult(
        project_id=project.id,
        project_name=project.name,
        baseline={
            "risk_score": baseline_prediction["risk_score"],
            "risk_level": baseline_prediction["risk_level"],
            "delay_probability": baseline_prediction["delay_probability"],
            "predicted_delay_months": baseline_prediction["predicted_delay_months"],
            "cost_overrun_probability": baseline_prediction["cost_overrun_probability"],
            "predicted_final_cost": baseline_prediction["predicted_final_cost"]
        },
        simulated={
            "risk_score": simulated_prediction["risk_score"],
            "risk_level": simulated_prediction["risk_level"],
            "delay_probability": simulated_prediction["delay_probability"],
            "predicted_delay_months": simulated_prediction["predicted_delay_months"],
            "cost_overrun_probability": simulated_prediction["cost_overrun_probability"],
            "predicted_final_cost": simulated_prediction["predicted_final_cost"]
        },
        deltas={
            "risk_score_delta": risk_delta,
            "delay_probability_delta": delay_delta,
            "predicted_final_cost_delta": cost_delta
        },
        insights=insights
    )
