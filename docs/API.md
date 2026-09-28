# PAIMANA Sentinel AI — API Reference

Base URL: `/api/v1`

## Authentication
- `POST /auth/login`: Authenticate government user credentials and receive JWT access/refresh tokens.
- `GET /auth/me`: Retrieve currently authenticated user context and permissions.
- `POST /auth/refresh`: Refresh expired access token.

## Projects
- `GET /projects`: Paginated list of mega infrastructure projects with multi-parameter filtering (ministry, sector, state, risk level, cost range).
- `GET /projects/{projectId}`: Detailed project breakdown including monthly milestones, expenditure history, and statutory clearance statuses.

## Predictions & Explainability
- `GET /predictions/{projectId}`: Live ML inference returning risk score, delay probability, predicted final cost, and top SHAP feature drivers.

## What-If Simulator
- `POST /simulator/simulate`: Interactive scenario modeling calculating Before/After risk deltas and projected cost/schedule impacts.

## Early Warnings & Alerts
- `GET /alerts`: Filterable list of active, reviewed, and resolved early warning signals.
- `PATCH /alerts/{alertId}`: Update alert status, assign to task force officer, or record resolution notes.

## National Analytics
- `GET /analytics/overview`: High-level executive aggregates (national cost exposure, delay months exposure, ministry/sector breakdowns).

## AI Assistant (RAG)
- `POST /assistant/chat`: Natural language queries answering infrastructure questions strictly grounded on live project data.

## Model Performance
- `GET /models/metrics`: Accuracy, Precision, Recall, F1, ROC-AUC metrics and CUF baseline comparison.
