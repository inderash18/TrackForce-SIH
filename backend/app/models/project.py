import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(50), primary_key=True)  # e.g., 'PRJ-2024-001'
    name = Column(String(500), nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    ministry = Column(String(255), nullable=False, index=True)
    sector = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=True)
    implementing_agency = Column(String(255), nullable=False)
    project_category = Column(String(100), default="Mega Project (>1000 Cr)")
    
    # Financial metrics (in Crores INR)
    original_cost = Column(Float, nullable=False)
    revised_cost = Column(Float, nullable=False)
    expenditure = Column(Float, nullable=False)
    cumulative_expenditure_pct = Column(Float, default=0.0)
    
    # Timeline
    approval_date = Column(String(50), nullable=True)
    original_completion = Column(String(50), nullable=False)
    revised_completion = Column(String(50), nullable=False)
    predicted_completion = Column(String(50), nullable=False)
    
    # Progress & Risk
    physical_progress = Column(Float, nullable=False)  # 0 to 100
    financial_progress = Column(Float, nullable=False) # 0 to 100
    expected_progress = Column(Float, nullable=False)  # 0 to 100
    progress_gap = Column(Float, default=0.0)
    progress_velocity = Column(Float, default=1.0)     # % per month
    
    # Risk Scores (0 to 100)
    risk_score = Column(Float, nullable=False, index=True)
    risk_level = Column(String(20), nullable=False, index=True) # Low, Medium, High, Critical
    delay_probability = Column(Float, nullable=False)  # 0 to 100
    cost_overrun_probability = Column(Float, nullable=False) # 0 to 100
    predicted_delay_months = Column(Integer, default=0)
    predicted_final_cost = Column(Float, nullable=False)
    cost_risk = Column(String(20), default="Moderate") # Low, Moderate, High, Severe
    status = Column(String(50), default="In Progress") # In Progress, Delayed, On Track, Critical Delay, Completed
    
    # Coordinates for GIS Map
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Execution parameters
    contractor_rating = Column(Float, default=4.0)
    land_acquisition_pct = Column(Float, default=100.0)
    forest_clearance_status = Column(String(50), default="Approved")
    environment_clearance_status = Column(String(50), default="Approved")
    r_and_r_status = Column(String(50), default="Complete")
    
    # JSON rich structures
    shap_drivers = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    monthly_trends = Column(JSON, default=list)
    milestones = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
