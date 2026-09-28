from fastapi import APIRouter

router = APIRouter(prefix="/models", tags=["Model Performance"])

@router.get("/metrics")
def get_model_metrics():
    return {
        "models": [
            {
                "name": "LightGBM Classifier + Regressor",
                "version": "v2.4",
                "status": "Active (Champion)",
                "accuracy": 0.912,
                "precision": 0.895,
                "recall": 0.931,
                "f1_score": 0.913,
                "roc_auc": 0.958,
                "training_samples": 4820,
                "latency_ms": 14.2
            },
            {
                "name": "XGBoost Gradient Boosted Ensemble",
                "version": "v2.3",
                "status": "Candidate (Challenger)",
                "accuracy": 0.898,
                "precision": 0.881,
                "recall": 0.914,
                "f1_score": 0.897,
                "roc_auc": 0.946,
                "training_samples": 4820,
                "latency_ms": 18.5
            },
            {
                "name": "Random Forest Classifier",
                "version": "v1.8",
                "status": "Baseline",
                "accuracy": 0.842,
                "precision": 0.820,
                "recall": 0.855,
                "f1_score": 0.837,
                "roc_auc": 0.889,
                "training_samples": 4820,
                "latency_ms": 26.0
            },
            {
                "name": "Logistic Regression (CUF Standard)",
                "version": "v1.0",
                "status": "Legacy Baseline",
                "accuracy": 0.724,
                "precision": 0.690,
                "recall": 0.740,
                "f1_score": 0.714,
                "roc_auc": 0.762,
                "training_samples": 4820,
                "latency_ms": 4.1
            }
        ],
        "feature_importance": [
            {"feature": "Progress Gap (Planned - Actual)", "importance": 0.285},
            {"feature": "Land Acquisition % Completed", "importance": 0.224},
            {"feature": "Cost Growth Ratio", "importance": 0.186},
            {"feature": "Contractor Past Velocity Index", "importance": 0.142},
            {"feature": "Statutory Clearance Bottleneck Score", "importance": 0.108},
            {"feature": "Expenditure Absorption Rate", "importance": 0.055}
        ],
        "cuf_comparison": {
            "cuf_only": {
                "features_count": 8,
                "roc_auc": 0.762,
                "f1_score": 0.714,
                "false_positive_rate": 0.28
            },
            "cuf_plus_advanced_engineering": {
                "features_count": 24,
                "roc_auc": 0.958,
                "f1_score": 0.913,
                "false_positive_rate": 0.07,
                "lift_pct": 25.7
            }
        }
    }
