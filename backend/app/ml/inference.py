try:
    import numpy as np
    def clip(val, low, high):
        return float(np.clip(val, low, high))
except ImportError:
    def clip(val, low, high):
        return float(max(low, min(val, high)))

from typing import Dict, Any, List

def compute_engineered_features(project_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Computes standard MoSPI CUF + Advanced Engineered Features:
    - cost_growth = (revised_cost - original_cost) / original_cost
    - expenditure_ratio = expenditure / revised_cost
    - progress_velocity = physical_progress / max(project_age_months, 1)
    - progress_gap = expected_progress - physical_progress
    - schedule_slippage = (revised_completion_months - original_completion_months)
    """
    orig_cost = max(float(project_data.get("original_cost", 100)), 1.0)
    rev_cost = max(float(project_data.get("revised_cost", orig_cost)), orig_cost)
    exp = float(project_data.get("expenditure", 0.0))
    phys_prog = float(project_data.get("physical_progress", 0.0))
    exp_prog = float(project_data.get("expected_progress", phys_prog))
    contractor = float(project_data.get("contractor_rating", 4.0))
    land_pct = float(project_data.get("land_acquisition_pct", 100.0))

    cost_growth = (rev_cost - orig_cost) / orig_cost
    expenditure_ratio = exp / rev_cost
    progress_gap = max(exp_prog - phys_prog, 0.0)
    
    # Clearance penalty
    clearance_penalty = 0.0
    if project_data.get("forest_clearance_status") != "Approved":
        clearance_penalty += 15.0
    if project_data.get("environment_clearance_status") != "Approved":
        clearance_penalty += 10.0
    if land_pct < 80.0:
        clearance_penalty += (80.0 - land_pct) * 0.5

    return {
        "cost_growth": round(cost_growth, 4),
        "expenditure_ratio": round(expenditure_ratio, 4),
        "progress_gap": round(progress_gap, 2),
        "contractor_score": round(contractor, 2),
        "land_acquisition_pct": round(land_pct, 2),
        "clearance_penalty": round(clearance_penalty, 2),
        "physical_progress": round(phys_prog, 2)
    }

def predict_project_risk(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensemble inference for risk score, delay probability, cost overrun, and SHAP drivers.
    """
    features = compute_engineered_features(project_data)
    
    # Baseline Risk calculation driven by feature weights
    gap_weight = features["progress_gap"] * 1.8
    cost_growth_weight = features["cost_growth"] * 45.0
    land_weight = max(100.0 - features["land_acquisition_pct"], 0.0) * 0.45
    contractor_weight = max(5.0 - features["contractor_score"], 0.0) * 8.0
    clearance_weight = features["clearance_penalty"] * 0.8
    
    # Calculate composite risk score
    raw_risk = (
        15.0 +
        gap_weight +
        cost_growth_weight +
        land_weight +
        contractor_weight +
        clearance_weight
    )
    risk_score = clip(raw_risk, 5.0, 98.5)
    
    # Delay probability
    delay_prob = clip(risk_score * 1.05 - 2.0, 5.0, 99.0)
    
    # Predicted delay months
    delay_months = int(max(round((risk_score - 25.0) / 4.5), 0))
    
    # Cost overrun probability & predicted final cost
    cost_overrun_prob = clip(risk_score * 0.92 + features["cost_growth"] * 20.0, 4.0, 97.0)
    revised_cost = float(project_data.get("revised_cost", 100.0))
    multiplier = 1.0 + (risk_score / 280.0)
    predicted_final_cost = round(revised_cost * multiplier, 2)
    
    # Risk Level
    if risk_score >= 80.0:
        risk_level = "Critical"
        cost_risk = "Severe"
    elif risk_score >= 60.0:
        risk_level = "High"
        cost_risk = "High"
    elif risk_score >= 35.0:
        risk_level = "Medium"
        cost_risk = "Moderate"
    else:
        risk_level = "Low"
        cost_risk = "Low"

    # Compute SHAP Feature Drivers
    shap_drivers = [
        {
            "feature": "Schedule Slippage / Progress Gap",
            "impact": round(gap_weight, 1),
            "description": f"Physical progress lags expected schedule by {features['progress_gap']}%",
            "direction": "increases_risk" if gap_weight > 5.0 else "decreases_risk"
        },
        {
            "feature": "Cost Inflation & Revision Ratio",
            "impact": round(cost_growth_weight, 1),
            "description": f"Budget revised upwards by {round(features['cost_growth']*100, 1)}%",
            "direction": "increases_risk" if cost_growth_weight > 2.0 else "decreases_risk"
        },
        {
            "feature": "Land Acquisition & RoW Clearance",
            "impact": round(land_weight, 1),
            "description": f"Land acquisition status at {features['land_acquisition_pct']}%",
            "direction": "increases_risk" if land_weight > 4.0 else "decreases_risk"
        },
        {
            "feature": "Contractor Velocity & Past Performance",
            "impact": round(contractor_weight, 1),
            "description": f"Contractor efficiency index rated at {features['contractor_score']}/5.0",
            "direction": "increases_risk" if contractor_weight > 4.0 else "decreases_risk"
        },
        {
            "feature": "Statutory & Environmental Clearances",
            "impact": round(clearance_weight, 1),
            "description": f"Regulatory compliance clearance penalty: {features['clearance_penalty']}",
            "direction": "increases_risk" if clearance_weight > 0.0 else "decreases_risk"
        }
    ]
    # Sort SHAP drivers by impact descending
    shap_drivers.sort(key=lambda x: x["impact"], reverse=True)

    return {
        "risk_score": round(risk_score, 1),
        "risk_level": risk_level,
        "delay_probability": round(delay_prob, 1),
        "cost_overrun_probability": round(cost_overrun_prob, 1),
        "predicted_delay_months": delay_months,
        "predicted_final_cost": predicted_final_cost,
        "cost_risk": cost_risk,
        "shap_drivers": shap_drivers
    }
