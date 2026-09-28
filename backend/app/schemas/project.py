from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ShapDriver(BaseModel):
    feature: str
    impact: float
    description: str
    direction: str  # "increases_risk" or "decreases_risk"

class Recommendation(BaseModel):
    action: str
    priority: str   # "Critical", "High", "Medium", "Low"
    reason: str
    expected_impact: str

class MonthlyTrend(BaseModel):
    month: str
    planned_progress: float
    actual_progress: float
    planned_spend: float
    actual_spend: float
    risk_score: float

class Milestone(BaseModel):
    name: str
    planned_date: str
    actual_date: Optional[str] = None
    status: str     # "Completed", "In Progress", "Delayed", "Pending"

class ProjectBase(BaseModel):
    id: str
    name: str
    code: str
    ministry: str
    sector: str
    state: str
    district: Optional[str] = None
    implementing_agency: str
    project_category: str = "Mega Project (>1000 Cr)"
    original_cost: float
    revised_cost: float
    expenditure: float
    original_completion: str
    revised_completion: str
    predicted_completion: str
    physical_progress: float
    financial_progress: float
    expected_progress: float
    progress_velocity: float = 1.0
    risk_score: float
    risk_level: str
    delay_probability: float
    cost_overrun_probability: float
    predicted_delay_months: int = 0
    predicted_final_cost: float
    cost_risk: str = "Moderate"
    status: str = "In Progress"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contractor_rating: float = 4.0
    land_acquisition_pct: float = 100.0
    forest_clearance_status: str = "Approved"
    environment_clearance_status: str = "Approved"
    r_and_r_status: str = "Complete"

    class Config:
        from_attributes = True
        populate_by_name = True

class ProjectDetail(ProjectBase):
    shap_drivers: List[Dict[str, Any]] = []
    recommendations: List[Dict[str, Any]] = []
    monthly_trends: List[Dict[str, Any]] = []
    milestones: List[Dict[str, Any]] = []

class ProjectFilter(BaseModel):
    search: Optional[str] = None
    ministry: Optional[str] = None
    sector: Optional[str] = None
    state: Optional[str] = None
    risk_level: Optional[str] = None
    status: Optional[str] = None
    min_cost: Optional[float] = None
    max_cost: Optional[float] = None
    page: int = 1
    page_size: int = 20
    sort_by: str = "risk_score"
    sort_order: str = "desc"

class PaginatedProjects(BaseModel):
    items: List[ProjectBase]
    total: int
    page: int
    page_size: int
    total_pages: int
