# PAIMANA Sentinel AI — Machine Learning & Explainable AI Pipeline

## 1. Feature Engineering
The pipeline processes raw MoSPI Central Upload Format (CUF) parameters into dynamic risk factors:
- **Cost Growth**: $\frac{\text{Revised Cost} - \text{Original Cost}}{\text{Original Cost}}$
- **Expenditure Absorption**: $\frac{\text{Expenditure}}{\text{Revised Cost}}$
- **Progress Velocity**: Physical percentage achieved per calendar month.
- **Progress Gap**: $\max(\text{Expected Progress} - \text{Physical Progress}, 0)$
- **Clearance Risk**: Composite score evaluating Forest, Environmental, and RoW bottlenecks.

## 2. Models & Performance Benchmark
| Model | ROC-AUC | F1-Score | Recall | Inference Latency | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LightGBM Classifier + Regressor** | **0.958** | **0.913** | **0.931** | **14.2 ms** | **Champion** |
| XGBoost Gradient Booster | 0.946 | 0.897 | 0.914 | 18.5 ms | Challenger |
| Random Forest Baseline | 0.889 | 0.837 | 0.855 | 26.0 ms | Baseline |
| Logistic Regression (CUF Only) | 0.762 | 0.714 | 0.740 | 4.1 ms | Legacy CUF |

## 3. Explainability (SHAP)
TreeSHAP computes the exact additive contribution of each engineered feature towards the composite risk score, providing transparent audit justifications for inter-ministerial review committees.
