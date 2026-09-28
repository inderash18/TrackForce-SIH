import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from app.db.session import Base

class EarlyWarningAlert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True) # e.g., 'ALT-2024-001'
    project_id = Column(String(50), nullable=False, index=True)
    project_name = Column(String(500), nullable=False)
    ministry = Column(String(255), nullable=False)
    sector = Column(String(100), nullable=False)
    
    warning_type = Column(String(100), nullable=False) # Schedule Slippage, Cost Surge, Land Clearance Stall, Velocity Drop, Milestone Breach
    severity = Column(String(20), nullable=False, index=True) # Critical, High, Medium, Low
    
    previous_risk = Column(Float, nullable=False)
    new_risk = Column(Float, nullable=False)
    
    reason = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    responsible_team = Column(String(255), nullable=False)
    assigned_to = Column(String(255), nullable=True)
    
    status = Column(String(30), default="Active", index=True) # Active, In Review, Escalated, Resolved
    resolution_notes = Column(Text, nullable=True)
    resolved_by = Column(String(255), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(50), nullable=False, index=True)
    model_version = Column(String(50), default="v2.4-xgboost-ensemble")
    risk_score = Column(Float, nullable=False)
    delay_probability = Column(Float, nullable=False)
    cost_overrun_probability = Column(Float, nullable=False)
    predicted_delay_months = Column(Integer, nullable=False)
    predicted_final_cost = Column(Float, nullable=False)
    shap_features = Column(JSON, default=dict)
    input_snapshot = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(255), nullable=True)
    user_name = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class DocumentKnowledge(Base):
    __tablename__ = "document_knowledge"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    doc_type = Column(String(50), nullable=False) # MoSPI_Guideline, Project_Charter, Monthly_Review, Audit_Report
    project_id = Column(String(50), nullable=True)
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
