# PAIMANA Sentinel AI — System Architecture

## 1. System Overview
**PAIMANA Sentinel AI** is an AI-powered predictive intelligence and early warning platform engineered for the **Ministry of Statistics and Programme Implementation (MoSPI)** and the **Infrastructure Monitoring Division (IMD)**.

The system acts as a non-intrusive intelligence overlay over the Central Upload Format (CUF) and PM GatiShakti GIS data streams.

```
+-------------------------------------------------------------------------------+
|                           PAIMANA Sentinel AI Platform                        |
+-------------------------------------------------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                                                 |
    v                                                                 v
+-------------------------------+                     +-------------------------------+
|     Frontend (React 19 / TS)  | <=== (REST / JSON) =|   Backend (FastAPI Asynchronous)|
|  - Enterprise Deep Navy UI    |                     |  - JWT & RBAC Engine          |
|  - Leaflet GIS Spatial Engine |                     |  - High-Throughput REST APIs  |
|  - Interactive What-If Sim    |                     |  - Real-Time Simulation Engine|
|  - SHAP Force Plot / Visuals  |                     |  - Task Scheduler (Celery)    |
+-------------------------------+                     +-------------------------------+
                                                                 |
            +----------------------------------------------------+-------------------------+
            |                                                    |                         |
            v                                                    v                         v
+-----------------------+                            +----------------------+   +--------------------+
|  ML Predictive Core   |                            |   Knowledge RAG Core |   | PostgreSQL Database|
| - LightGBM & XGBoost  |                            | - Ollama (Qwen 2.5)  |   | - pgvector         |
| - SHAP TreeExplainer  |                            | - MoSPI Policy RAG   |   | - Projects Schema  |
| - Delay & Cost Models |                            | - Strict Citations   |   | - RBAC & Audits    |
+-----------------------+                            +----------------------+   +--------------------+
```

## 2. Layered Responsibilities
1. **Frontend Presentation**: Responsive UI tailored for executive dashboards, spatial intelligence, and granular project drilling.
2. **FastAPI Gateway**: Asynchronous request processing, JWT authentication, and strict permission enforcement.
3. **ML Prediction Engine**: Decoupled ensemble scoring evaluating physical velocity, cost revisions, and statutory bottlenecks.
4. **SHAP Explainability**: Translates complex multi-dimensional tree decisions into plain-language, audited risk driver contributions.
5. **RAG Assistant**: Strictly constrained retrieval-augmented assistant that explains predictions using live database facts.
