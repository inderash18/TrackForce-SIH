# PAIMANA Sentinel AI — Database & Schema Design

Database: **PostgreSQL 16 + pgvector**

## Core Relational Tables
1. **users**: RBAC accounts (`SUPER_ADMIN`, `MOSPI_ADMIN`, `MINISTRY_OFFICER`, `PROJECT_ADMIN`, `ANALYST`, `VIEWER`).
2. **projects**: Infrastructure project definitions, approved/revised costs, physical progress, execution coordinates, and statutory clearance attributes.
3. **alerts**: Early warnings flagged by threshold deviations and predictive score jumps.
4. **prediction_logs**: Time-series audit log of model versions, risk outputs, and SHAP vector snapshots.
5. **audit_logs**: Tamper-evident logging of administrative actions, user logins, and alert status transitions.
6. **document_knowledge**: Embeddings and textual chunks from MoSPI manuals, Flash Reports, and project charters for vector similarity search.

## Indexes
- `projects(ministry)`, `projects(sector)`, `projects(state)`, `projects(risk_level)`, `projects(risk_score)`
- `alerts(severity)`, `alerts(status)`, `alerts(timestamp)`
- `users(email)`, `users(role)`
