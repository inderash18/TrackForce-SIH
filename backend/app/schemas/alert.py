from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class AlertBase(BaseModel):
    id: str
    project_id: str
    project_name: str
    ministry: str
    sector: str
    warning_type: str
    severity: str
    previous_risk: float
    new_risk: float
    reason: str
    recommended_action: str
    responsible_team: str
    assigned_to: Optional[str] = None
    status: str = "Active"
    resolution_notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None

class SimulationRequest(BaseModel):
    project_id: str
    physical_progress: Optional[float] = None
    monthly_progress_rate: Optional[float] = None
    funding_availability: Optional[float] = None  # % (e.g. 100% or 80%)
    contractor_performance: Optional[float] = None # rating 1.0 - 5.0
    land_acquisition_pct: Optional[float] = None # 0 - 100%
    clearance_status: Optional[str] = None       # "Approved", "Pending", "Stalled"
    resources_level: Optional[float] = None       # 50 - 150%
    milestone_completion_rate: Optional[float] = None

class SimulationResult(BaseModel):
    project_id: str
    project_name: str
    baseline: Dict[str, Any]
    simulated: Dict[str, Any]
    deltas: Dict[str, Any]
    insights: List[str]

class ChatMessage(BaseModel):
    role: str # "user", "assistant", "system"
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    project_id: Optional[str] = None
    ministry: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    citations: List[Dict[str, Any]] = []
    suggested_questions: List[str] = []

class NationalMetrics(BaseModel):
    total_projects: int
    original_cost_total: float
    revised_cost_total: float
    expenditure_total: float
    critical_projects_count: int
    high_risk_projects_count: int
    predicted_delayed_projects: int
    predicted_cost_overrun_projects: int
    average_risk_score: float
    national_cost_overrun_exposure: float
    national_delay_exposure_months: float
    risk_distribution: Dict[str, int]
    ministry_breakdown: List[Dict[str, Any]]
    sector_breakdown: List[Dict[str, Any]]
    top_critical_projects: List[Dict[str, Any]]
    top_risk_drivers: List[Dict[str, Any]]
