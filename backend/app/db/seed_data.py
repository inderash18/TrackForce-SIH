from typing import List, Dict, Any
from app.db.session import SessionLocal, engine, Base
from app.models.user import User
from app.models.project import Project
from app.models.alert import EarlyWarningAlert, DocumentKnowledge
from app.core.security import get_password_hash

NATIONAL_PROJECTS_SEED = [
    {
        "id": "PRJ-2024-001",
        "code": "RAIL-HSR-001",
        "name": "Delhi - Varanasi High Speed Rail Corridor",
        "ministry": "Ministry of Railways",
        "sector": "Railways",
        "state": "Uttar Pradesh",
        "district": "Varanasi / Lucknow",
        "implementing_agency": "NHSRCL",
        "project_category": "Mega Project (>1000 Cr)",
        "original_cost": 121000.0,
        "revised_cost": 138500.0,
        "expenditure": 48200.0,
        "cumulative_expenditure_pct": 34.8,
        "approval_date": "2021-06-15",
        "original_completion": "2028-12-31",
        "revised_completion": "2030-06-30",
        "predicted_completion": "2031-03-31",
        "physical_progress": 38.5,
        "financial_progress": 34.8,
        "expected_progress": 56.0,
        "progress_velocity": 0.85,
        "risk_score": 84.5,
        "risk_level": "Critical",
        "delay_probability": 88.2,
        "cost_overrun_probability": 79.4,
        "predicted_delay_months": 15,
        "predicted_final_cost": 149200.0,
        "cost_risk": "Severe",
        "status": "Critical Delay",
        "latitude": 26.8467,
        "longitude": 80.9462,
        "contractor_rating": 3.4,
        "land_acquisition_pct": 68.5,
        "forest_clearance_status": "Stalled",
        "environment_clearance_status": "Pending",
        "r_and_r_status": "In Progress (62%)",
        "shap_drivers": [
            {"feature": "Land Acquisition & RoW Clearance", "impact": 28.4, "description": "31.5% of private land parcels in Ayodhya & Varanasi sections pending tribunal award", "direction": "increases_risk"},
            {"feature": "Schedule Slippage / Progress Gap", "impact": 22.1, "description": "Physical progress is 17.5% behind target milestone velocity", "direction": "increases_risk"},
            {"feature": "Forest & Environmental Clearances", "impact": 18.3, "description": "Eco-sensitive corridor approval pending at Stage-2 MoEFCC committee", "direction": "increases_risk"},
            {"feature": "Contractor Civil Velocity", "impact": 11.2, "description": "Viaduct girder launching speed is 22% below DPR contractual commitments", "direction": "increases_risk"}
        ],
        "recommendations": [
            {"action": "Convene Special Inter-Ministerial Land Acquisition Tribunal", "priority": "Critical", "reason": "31.5% land pending in high-density districts", "expected_impact": "Reduces projected delay by 6 months and risk score by 14 pts"},
            {"action": "Parallel Environmental Clearance Track", "priority": "High", "reason": "Stage-2 MoEFCC clearance pending for 8 months", "expected_impact": "Unlocks 42 km of right-of-way viaduct construction"},
            {"action": "Deploy Second Launching Gantry at Package C4", "priority": "High", "reason": "Current single gantry operating at peak capacity", "expected_impact": "Boosts monthly physical progress rate from 0.85% to 1.6%"}
        ],
        "monthly_trends": [
            {"month": "Oct 2025", "planned_progress": 48.0, "actual_progress": 35.2, "planned_spend": 41000, "actual_spend": 39500, "risk_score": 76.2},
            {"month": "Nov 2025", "planned_progress": 50.5, "actual_progress": 36.1, "planned_spend": 43500, "actual_spend": 42000, "risk_score": 79.0},
            {"month": "Dec 2025", "planned_progress": 53.0, "actual_progress": 37.0, "planned_spend": 46000, "actual_spend": 45100, "risk_score": 81.8},
            {"month": "Jan 2026", "planned_progress": 54.5, "actual_progress": 37.8, "planned_spend": 48500, "actual_spend": 46800, "risk_score": 83.1},
            {"month": "Feb 2026", "planned_progress": 56.0, "actual_progress": 38.5, "planned_spend": 51000, "actual_spend": 48200, "risk_score": 84.5}
        ],
        "milestones": [
            {"name": "Detailed Project Report & Alignment Freeze", "planned_date": "2021-12-31", "actual_date": "2022-03-15", "status": "Completed"},
            {"name": "Land Acquisition Phase 1 (80% target)", "planned_date": "2023-06-30", "actual_date": None, "status": "Delayed"},
            {"name": "Civil Works Package C1-C3 Tender Award", "planned_date": "2023-12-31", "actual_date": "2024-04-20", "status": "Completed"},
            {"name": "Viaduct & Pier Construction 50% Milestone", "planned_date": "2025-08-31", "actual_date": None, "status": "Delayed"},
            {"name": "Track Laying & Power Substation Setup", "planned_date": "2027-06-30", "actual_date": None, "status": "Pending"}
        ]
    },
    {
        "id": "PRJ-2024-002",
        "code": "HWY-EXP-002",
        "name": "Bengaluru - Chennai Expressway (NE-7)",
        "ministry": "Ministry of Road Transport & Highways",
        "sector": "Roads & Highways",
        "state": "Karnataka / Tamil Nadu / Andhra Pradesh",
        "district": "Hosur / Kolar / Chittoor / Sriperumbudur",
        "implementing_agency": "NHAI",
        "project_category": "Mega Project (>1000 Cr)",
        "original_cost": 17930.0,
        "revised_cost": 19450.0,
        "expenditure": 15800.0,
        "cumulative_expenditure_pct": 81.2,
        "approval_date": "2020-02-10",
        "original_completion": "2024-03-31",
        "revised_completion": "2026-08-31",
        "predicted_completion": "2026-11-30",
        "physical_progress": 82.4,
        "financial_progress": 81.2,
        "expected_progress": 92.0,
        "progress_velocity": 1.75,
        "risk_score": 42.0,
        "risk_level": "Medium",
        "delay_probability": 38.5,
        "cost_overrun_probability": 28.0,
        "predicted_delay_months": 3,
        "predicted_final_cost": 19850.0,
        "cost_risk": "Moderate",
        "status": "In Progress",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "contractor_rating": 4.2,
        "land_acquisition_pct": 98.2,
        "forest_clearance_status": "Approved",
        "environment_clearance_status": "Approved",
        "r_and_r_status": "Complete (99%)",
        "shap_drivers": [
            {"feature": "Structure Finishing & Interchange RoW", "impact": 12.4, "description": "Minor bridge approach earthwork in Chittoor sector package 3", "direction": "increases_risk"},
            {"feature": "Contractor Velocity", "impact": 9.1, "description": "Paving team running dual-shift schedule with 1.75% monthly velocity", "direction": "decreases_risk"},
            {"feature": "High Land Acquisition Clearance", "impact": 8.5, "description": "98.2% clean right of way reduces risk significantly", "direction": "decreases_risk"}
        ],
        "recommendations": [
            {"action": "Expedite Tamil Nadu Section Final Toll Plaza Electrical Works", "priority": "Medium", "reason": "Prevent operational bottleneck prior to commissioning", "expected_impact": "Ensures trial run commencement by Q3 2026"}
        ],
        "monthly_trends": [
            {"month": "Oct 2025", "planned_progress": 84.0, "actual_progress": 77.0, "planned_spend": 14200, "actual_spend": 13900, "risk_score": 48.0},
            {"month": "Nov 2025", "planned_progress": 86.5, "actual_progress": 78.5, "planned_spend": 14900, "actual_spend": 14500, "risk_score": 46.2},
            {"month": "Dec 2025", "planned_progress": 88.5, "actual_progress": 80.0, "planned_spend": 15400, "actual_spend": 15100, "risk_score": 44.5},
            {"month": "Jan 2026", "planned_progress": 90.5, "actual_progress": 81.2, "planned_spend": 15900, "actual_spend": 15500, "risk_score": 43.0},
            {"month": "Feb 2026", "planned_progress": 92.0, "actual_progress": 82.4, "planned_spend": 16400, "actual_spend": 15800, "risk_score": 42.0}
        ],
        "milestones": [
            {"name": "Phase 1 Karnataka Section (71 km)", "planned_date": "2023-12-31", "actual_date": "2024-03-31", "status": "Completed"},
            {"name": "Phase 2 Andhra Pradesh Section (85 km)", "planned_date": "2024-08-31", "actual_date": "2025-01-15", "status": "Completed"},
            {"name": "Phase 3 Tamil Nadu Section (106 km)", "planned_date": "2025-12-31", "actual_date": None, "status": "In Progress"},
            {"name": "Commercial COD & Toll Operations", "planned_date": "2026-08-31", "actual_date": None, "status": "Pending"}
        ]
    },
    {
        "id": "PRJ-2024-003",
        "code": "MET-MUM-003",
        "name": "Mumbai Metro Line 4 (Wadala - Kasarvadavali)",
        "ministry": "Ministry of Housing and Urban Affairs",
        "sector": "Urban Infrastructure / Metro",
        "state": "Maharashtra",
        "district": "Mumbai / Thane",
        "implementing_agency": "MMRDA",
        "project_category": "Mega Project (>1000 Cr)",
        "original_cost": 14549.0,
        "revised_cost": 17890.0,
        "expenditure": 9120.0,
        "cumulative_expenditure_pct": 50.9,
        "approval_date": "2018-03-12",
        "original_completion": "2022-12-31",
        "revised_completion": "2026-12-31",
        "predicted_completion": "2027-09-30",
        "physical_progress": 54.8,
        "financial_progress": 50.9,
        "expected_progress": 78.0,
        "progress_velocity": 0.95,
        "risk_score": 77.8,
        "risk_level": "High",
        "delay_probability": 81.5,
        "cost_overrun_probability": 72.0,
        "predicted_delay_months": 9,
        "predicted_final_cost": 19200.0,
        "cost_risk": "High",
        "status": "Delayed",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "contractor_rating": 3.6,
        "land_acquisition_pct": 82.0,
        "forest_clearance_status": "Approved",
        "environment_clearance_status": "Approved",
        "r_and_r_status": "In Progress (78%)",
        "shap_drivers": [
            {"feature": "Depot Land Handover (Moglipada Depot)", "impact": 24.2, "description": "Rolling stock stabling yard land acquisition pending litigation resolution", "direction": "increases_risk"},
            {"feature": "Urban Traffic Utility Diversions", "impact": 19.5, "description": "High-voltage underground cable shifting delayed along LBS Marg", "direction": "increases_risk"},
            {"feature": "Progress Gap", "impact": 16.8, "description": "Current progress 54.8% vs scheduled 78.0%", "direction": "increases_risk"}
        ],
        "recommendations": [
            {"action": "Finalize Moglipada Integrated Depot Civil Contract", "priority": "Critical", "reason": "Trains cannot be commissioned without depot access", "expected_impact": "Avoids 12-month rolling stock delivery idle fees"}
        ],
        "monthly_trends": [
            {"month": "Oct 2025", "planned_progress": 68.0, "actual_progress": 51.0, "planned_spend": 10500, "actual_spend": 8200, "risk_score": 72.0},
            {"month": "Nov 2025", "planned_progress": 71.0, "actual_progress": 52.1, "planned_spend": 11100, "actual_spend": 8450, "risk_score": 73.8},
            {"month": "Dec 2025", "planned_progress": 73.5, "actual_progress": 53.0, "planned_spend": 11700, "actual_spend": 8700, "risk_score": 75.5},
            {"month": "Jan 2026", "planned_progress": 76.0, "actual_progress": 53.9, "planned_spend": 12300, "actual_spend": 8900, "risk_score": 76.7},
            {"month": "Feb 2026", "planned_progress": 78.0, "actual_progress": 54.8, "planned_spend": 12900, "actual_spend": 9120, "risk_score": 77.8}
        ],
        "milestones": [
            {"name": "Utility Shifting & Piling Phase 1", "planned_date": "2020-06-30", "actual_date": "2021-11-30", "status": "Completed"},
            {"name": "Pier Cap & U-Girder Erection (50%)", "planned_date": "2022-12-31", "actual_date": "2024-06-15", "status": "Completed"},
            {"name": "Moglipada Depot Infrastructure", "planned_date": "2024-03-31", "actual_date": None, "status": "Delayed"},
            {"name": "Rolling Stock & Signalling Integration", "planned_date": "2026-06-30", "actual_date": None, "status": "Pending"},
            {"name": "Safety Commissioner (CMRS) Clearance", "planned_date": "2026-12-31", "actual_date": None, "status": "Pending"}
        ]
    },
    {
        "id": "PRJ-2024-004",
        "code": "GAS-PLN-004",
        "name": "Jagdishpur - Haldia - Bokaro - Dhamra Natural Gas Pipeline (JHBDPL / Urja Ganga)",
        "ministry": "Ministry of Petroleum and Natural Gas",
        "sector": "Petroleum & Natural Gas",
        "state": "Bihar / Jharkhand / West Bengal / Odisha",
        "district": "Patna / Dhanbad / Durgapur / Dhamra",
        "implementing_agency": "GAIL",
        "project_category": "Mega Project (>1000 Cr)",
        "original_cost": 12940.0,
        "revised_cost": 13800.0,
        "expenditure": 12950.0,
        "cumulative_expenditure_pct": 93.8,
        "approval_date": "2016-09-21",
        "original_completion": "2020-12-31",
        "revised_completion": "2026-06-30",
        "predicted_completion": "2026-07-31",
        "physical_progress": 94.2,
        "financial_progress": 93.8,
        "expected_progress": 96.0,
        "progress_velocity": 1.45,
        "risk_score": 18.5,
        "risk_level": "Low",
        "delay_probability": 12.0,
        "cost_overrun_probability": 8.5,
        "predicted_delay_months": 1,
        "predicted_final_cost": 13920.0,
        "cost_risk": "Low",
        "status": "On Track",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "contractor_rating": 4.7,
        "land_acquisition_pct": 99.6,
        "forest_clearance_status": "Approved",
        "environment_clearance_status": "Approved",
        "r_and_r_status": "Complete (100%)",
        "shap_drivers": [
            {"feature": "Near Total Pipeline Lowering & Welding", "impact": 18.2, "description": "Over 3,100 km of trunk and spur lines commissioned", "direction": "decreases_risk"},
            {"feature": "Excellent Contractor Performance", "impact": 12.0, "description": "Turnkey EPC contractors achieved 99% schedule milestones", "direction": "decreases_risk"}
        ],
        "recommendations": [
            {"action": "Commission Remaining 4 City Gas Station Spur Connections in West Bengal", "priority": "Low", "reason": "Ensure downstream consumer hookup", "expected_impact": "Full commercial operational readiness"}
        ],
        "monthly_trends": [
            {"month": "Oct 2025", "planned_progress": 91.0, "actual_progress": 89.5, "planned_spend": 12100, "actual_spend": 11950, "risk_score": 24.0},
            {"month": "Nov 2025", "planned_progress": 92.5, "actual_progress": 91.0, "planned_spend": 12500, "actual_spend": 12300, "risk_score": 21.8},
            {"month": "Dec 2025", "planned_progress": 94.0, "actual_progress": 92.2, "planned_spend": 12800, "actual_spend": 12600, "risk_score": 20.1},
            {"month": "Jan 2026", "planned_progress": 95.0, "actual_progress": 93.4, "planned_spend": 13100, "actual_spend": 12800, "risk_score": 19.2},
            {"month": "Feb 2026", "planned_progress": 96.0, "actual_progress": 94.2, "planned_spend": 13400, "actual_spend": 12950, "risk_score": 18.5}
        ],
        "milestones": [
            {"name": "Phase 1 - Phulpur to Dobhi Section", "planned_date": "2019-06-30", "actual_date": "2019-08-15", "status": "Completed"},
            {"name": "Phase 2 - Dobhi to Durgapur Section", "planned_date": "2021-12-31", "actual_date": "2022-04-10", "status": "Completed"},
            {"name": "Phase 3 - Durgapur to Haldia Section", "planned_date": "2024-03-31", "actual_date": "2024-09-20", "status": "Completed"},
            {"name": "Dhamra Terminal Tie-In & Full Gasification", "planned_date": "2026-06-30", "actual_date": None, "status": "In Progress"}
        ]
    },
    {
        "id": "PRJ-2024-005",
        "code": "PWR-TRN-005",
        "name": "Green Energy Corridor Phase-II Inter-State Transmission Scheme",
        "ministry": "Ministry of Power",
        "sector": "Power & Renewable Energy",
        "state": "Gujarat / Rajasthan / Madhya Pradesh",
        "district": "Khavda / Bhadla / Bikaner",
        "implementing_agency": "Power Grid Corporation of India (PGCIL)",
        "project_category": "Mega Project (>1000 Cr)",
        "original_cost": 12031.0,
        "revised_cost": 12031.0,
        "expenditure": 7850.0,
        "cumulative_expenditure_pct": 65.2,
        "approval_date": "2022-01-06",
        "original_completion": "2026-03-31",
        "revised_completion": "2026-09-30",
        "predicted_completion": "2026-10-31",
        "physical_progress": 68.2,
        "financial_progress": 65.2,
        "expected_progress": 72.0,
        "progress_velocity": 1.6,
        "risk_score": 28.4,
        "risk_level": "Low",
        "delay_probability": 24.0,
        "cost_overrun_probability": 11.5,
        "predicted_delay_months": 1,
        "predicted_final_cost": 12150.0,
        "cost_risk": "Low",
        "status": "On Track",
        "latitude": 23.2420,
        "longitude": 69.6669,
        "contractor_rating": 4.8,
        "land_acquisition_pct": 96.0,
        "forest_clearance_status": "Approved",
        "environment_clearance_status": "Approved",
        "r_and_r_status": "Complete (100%)",
        "shap_drivers": [
            {"feature": "Rapid Substation Construction (Khavda HVDC)", "impact": 14.5, "description": "Civil foundation completed 45 days ahead of DPR schedule", "direction": "decreases_risk"},
            {"feature": "Right-of-Way in Desert Scrub Corridor", "impact": 11.2, "description": "Minimal private land acquisition friction in Kutch region", "direction": "decreases_risk"}
        ],
        "recommendations": [
            {"action": "Coordinate HVDC Transformer Delivery with Custom Port Authorities", "priority": "Medium", "reason": "Ensure heavy consignment transit window without monsoon delays", "expected_impact": "Maintains grid synchronization timeline"}
        ],
        "monthly_trends": [
            {"month": "Oct 2025", "planned_progress": 58.0, "actual_progress": 55.0, "planned_spend": 6200, "actual_spend": 6050, "risk_score": 33.0},
            {"month": "Nov 2025", "planned_progress": 62.0, "actual_progress": 59.2, "planned_spend": 6900, "actual_spend": 6650, "risk_score": 31.2},
            {"month": "Dec 2025", "planned_progress": 65.5, "actual_progress": 62.8, "planned_spend": 7400, "actual_spend": 7100, "risk_score": 30.0},
            {"month": "Jan 2026", "planned_progress": 69.0, "actual_progress": 65.4, "planned_spend": 8000, "actual_spend": 7500, "risk_score": 29.1},
            {"month": "Feb 2026", "planned_progress": 72.0, "actual_progress": 68.2, "planned_spend": 8600, "actual_spend": 7850, "risk_score": 28.4}
        ],
        "milestones": [
            {"name": "Substation Land Handover & Foundation", "planned_date": "2023-06-30", "actual_date": "2023-05-15", "status": "Completed"},
            {"name": "765 kV Tower Erection (Package 1 & 2)", "planned_date": "2024-12-31", "actual_date": "2025-02-28", "status": "Completed"},
            {"name": "Conductor Stringing & Optical Ground Wire", "planned_date": "2025-10-31", "actual_date": None, "status": "In Progress"},
            {"name": "Trial Operation & Grid Synchronization", "planned_date": "2026-09-30", "actual_date": None, "status": "Pending"}
        ]
    },
    {
        "id": "PRJ-2024-006",
        "code": "PRT-PRD-006",
        "name": "Vadhavan Mega Deep-Water Port Infrastructure",
        "ministry": "Ministry of Ports, Shipping and Waterways",
        "sector": "Ports & Shipping",
        "state": "Maharashtra",
        "district": "Palghar / Dahanu",
        "implementing_agency": "JNPA & Vadhavan Port Project Ltd (VPPL)",
        "project_category": "Mega Project (>1000 Cr)",
        "original_cost": 76220.0,
        "revised_cost": 76220.0,
        "expenditure": 4200.0,
        "cumulative_expenditure_pct": 5.5,
        "approval_date": "2024-06-19",
        "original_completion": "2030-12-31",
        "revised_completion": "2031-12-31",
        "predicted_completion": "2032-06-30",
        "physical_progress": 8.5,
        "financial_progress": 5.5,
        "expected_progress": 14.0,
        "progress_velocity": 0.45,
        "risk_score": 68.9,
        "risk_level": "High",
        "delay_probability": 72.4,
        "cost_overrun_probability": 65.0,
        "predicted_delay_months": 6,
        "predicted_final_cost": 82500.0,
        "cost_risk": "High",
        "status": "In Progress",
        "latitude": 19.9700,
        "longitude": 72.6900,
        "contractor_rating": 3.9,
        "land_acquisition_pct": 74.0,
        "forest_clearance_status": "Pending",
        "environment_clearance_status": "Approved",
        "r_and_r_status": "In Progress (60%)",
        "shap_drivers": [
            {"feature": "Offshore Reclamation & Breakwater Tenders", "impact": 21.0, "description": "Global dredging contract negotiation phase taking longer than estimated", "direction": "increases_risk"},
            {"feature": "Coastal Highway Connectivity Handover", "impact": 17.5, "description": "Palghar approach corridor land acquisition facing local stakeholder hearings", "direction": "increases_risk"}
        ],
        "recommendations": [
            {"action": "Finalize International Dredging Consortium Award by Q2 2026", "priority": "Critical", "reason": "Dredging window is monsoon dependent", "expected_impact": "Avoids an entire seasonal 9-month weather loss"}
        ],
        "monthly_trends": [
            {"month": "Oct 2025", "planned_progress": 8.0, "actual_progress": 5.0, "planned_spend": 2800, "actual_spend": 2100, "risk_score": 62.0},
            {"month": "Nov 2025", "planned_progress": 10.0, "actual_progress": 6.2, "planned_spend": 3400, "actual_spend": 2600, "risk_score": 64.5},
            {"month": "Dec 2025", "planned_progress": 11.5, "actual_progress": 7.0, "planned_spend": 4000, "actual_spend": 3100, "risk_score": 66.2},
            {"month": "Jan 2026", "planned_progress": 13.0, "actual_progress": 7.8, "planned_spend": 4700, "actual_spend": 3650, "risk_score": 67.8},
            {"month": "Feb 2026", "planned_progress": 14.0, "actual_progress": 8.5, "planned_spend": 5400, "actual_spend": 4200, "risk_score": 68.9}
        ],
        "milestones": [
            {"name": "Cabinet Approval & Special Purpose Vehicle Inception", "planned_date": "2024-06-30", "actual_date": "2024-06-19", "status": "Completed"},
            {"name": "Offshore Environmental Clearance & Public Hearing", "planned_date": "2024-12-31", "actual_date": "2025-01-20", "status": "Completed"},
            {"name": "Breakwater Construction & Offshore Reclamation EPC", "planned_date": "2026-06-30", "actual_date": None, "status": "In Progress"},
            {"name": "Container Berth Phase 1 Commissioning", "planned_date": "2029-12-31", "actual_date": None, "status": "Pending"}
        ]
    }
]

ALERTS_SEED = [
    {
        "id": "ALT-2026-001",
        "project_id": "PRJ-2024-001",
        "project_name": "Delhi - Varanasi High Speed Rail Corridor",
        "ministry": "Ministry of Railways",
        "sector": "Railways",
        "warning_type": "Land Acquisition & RoW Stall",
        "severity": "Critical",
        "previous_risk": 76.2,
        "new_risk": 84.5,
        "reason": "Ayodhya and Varanasi approach package land acquisition slowed down; tribunal compensation litigation pending for 31.5% of route parcels.",
        "recommended_action": "Convene Special Inter-Ministerial Land Acquisition Tribunal with Uttar Pradesh Revenue Board.",
        "responsible_team": "NHSRCL Land & Revenue Task Force",
        "assigned_to": "Vikas Sharma (Director, Land)",
        "status": "Active"
    },
    {
        "id": "ALT-2026-002",
        "project_id": "PRJ-2024-003",
        "project_name": "Mumbai Metro Line 4 (Wadala - Kasarvadavali)",
        "warning_type": "Depot Construction Bottleneck",
        "severity": "High",
        "ministry": "Ministry of Housing and Urban Affairs",
        "sector": "Urban Infrastructure / Metro",
        "previous_risk": 71.0,
        "new_risk": 77.8,
        "reason": "Moglipada car shed depot civil package tender stalled due to local environmental challenge in High Court.",
        "recommended_action": "Submit expeditious affidavit on tree replantation audit to vacate depot stay.",
        "responsible_team": "MMRDA Legal & Projects Cell",
        "assigned_to": "Pooja Patil (Executive Engineer)",
        "status": "In Review"
    },
    {
        "id": "ALT-2026-003",
        "project_id": "PRJ-2024-006",
        "project_name": "Vadhavan Mega Deep-Water Port Infrastructure",
        "warning_type": "Dredging Window Pre-Monsoon Risk",
        "severity": "High",
        "ministry": "Ministry of Ports, Shipping and Waterways",
        "sector": "Ports & Shipping",
        "previous_risk": 62.0,
        "new_risk": 68.9,
        "reason": "Global dredging contract negotiations must conclude by April 2026 to mobilize offshore fleet before SW monsoon.",
        "recommended_action": "Fast-track technical bid evaluation committee clearance.",
        "responsible_team": "VPPL Marine Engineering Group",
        "assigned_to": "Capt. R. Deshmukh",
        "status": "Active"
    },
    {
        "id": "ALT-2026-004",
        "project_id": "PRJ-2024-002",
        "project_name": "Bengaluru - Chennai Expressway (NE-7)",
        "warning_type": "Minor Toll Plaza Electrical Delay",
        "severity": "Medium",
        "ministry": "Ministry of Road Transport & Highways",
        "sector": "Roads & Highways",
        "previous_risk": 48.0,
        "new_risk": 42.0,
        "reason": "State electrical utility HT line charging pending for 2 toll plazas in Tamil Nadu package.",
        "recommended_action": "Coordinate deposit work inspection with TANGEDCO.",
        "responsible_team": "NHAI Project Implementation Unit (PIU Chennai)",
        "assigned_to": "K. Venkatesh (Project Director)",
        "status": "Resolved"
    }
]

USERS_SEED = [
    {
        "id": "USR-001",
        "email": "admin@mospi.gov.in",
        "name": "Dr. Rajeshwar Rao",
        "role": "SUPER_ADMIN",
        "ministry": "Ministry of Statistics and Programme Implementation",
        "department": "Infrastructure Monitoring Division (IMD)"
    },
    {
        "id": "USR-002",
        "email": "railways.officer@gov.in",
        "name": "Ananya Sengupta",
        "role": "MINISTRY_OFFICER",
        "ministry": "Ministry of Railways",
        "department": "Railway Board Planning & Execution"
    },
    {
        "id": "USR-003",
        "email": "morth.officer@gov.in",
        "name": "Col. Hardeep Singh",
        "role": "MINISTRY_OFFICER",
        "ministry": "Ministry of Road Transport & Highways",
        "department": "Highways & Expressways Division"
    },
    {
        "id": "USR-004",
        "email": "analyst@paimana.gov.in",
        "name": "Priya Nambiar",
        "role": "ANALYST",
        "ministry": "MoSPI PAIMANA Cell",
        "department": "Predictive Analytics Unit"
    }
]

def init_and_seed_database():
    """Initializes tables and populates with high-fidelity seed data if empty"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed Users
        if db.query(User).count() == 0:
            for u in USERS_SEED:
                user_obj = User(
                    id=u["id"],
                    email=u["email"],
                    name=u["name"],
                    hashed_password=get_password_hash("Paimana@2026"),
                    role=u["role"],
                    ministry=u["ministry"],
                    department=u["department"],
                    is_active=True,
                    is_verified=True
                )
                db.add(user_obj)
            db.commit()

        # Seed Projects
        if db.query(Project).count() == 0:
            for p in NATIONAL_PROJECTS_SEED:
                prj = Project(
                    id=p["id"],
                    name=p["name"],
                    code=p["code"],
                    ministry=p["ministry"],
                    sector=p["sector"],
                    state=p["state"],
                    district=p["district"],
                    implementing_agency=p["implementing_agency"],
                    project_category=p["project_category"],
                    original_cost=p["original_cost"],
                    revised_cost=p["revised_cost"],
                    expenditure=p["expenditure"],
                    cumulative_expenditure_pct=p["cumulative_expenditure_pct"],
                    approval_date=p["approval_date"],
                    original_completion=p["original_completion"],
                    revised_completion=p["revised_completion"],
                    predicted_completion=p["predicted_completion"],
                    physical_progress=p["physical_progress"],
                    financial_progress=p["financial_progress"],
                    expected_progress=p["expected_progress"],
                    progress_velocity=p["progress_velocity"],
                    risk_score=p["risk_score"],
                    risk_level=p["risk_level"],
                    delay_probability=p["delay_probability"],
                    cost_overrun_probability=p["cost_overrun_probability"],
                    predicted_delay_months=p["predicted_delay_months"],
                    predicted_final_cost=p["predicted_final_cost"],
                    cost_risk=p["cost_risk"],
                    status=p["status"],
                    latitude=p["latitude"],
                    longitude=p["longitude"],
                    contractor_rating=p["contractor_rating"],
                    land_acquisition_pct=p["land_acquisition_pct"],
                    forest_clearance_status=p["forest_clearance_status"],
                    environment_clearance_status=p["environment_clearance_status"],
                    r_and_r_status=p["r_and_r_status"],
                    shap_drivers=p["shap_drivers"],
                    recommendations=p["recommendations"],
                    monthly_trends=p["monthly_trends"],
                    milestones=p["milestones"]
                )
                db.add(prj)
            db.commit()

        # Seed Alerts
        if db.query(EarlyWarningAlert).count() == 0:
            for a in ALERTS_SEED:
                alt = EarlyWarningAlert(
                    id=a["id"],
                    project_id=a["project_id"],
                    project_name=a["project_name"],
                    ministry=a["ministry"],
                    sector=a["sector"],
                    warning_type=a["warning_type"],
                    severity=a["severity"],
                    previous_risk=a["previous_risk"],
                    new_risk=a["new_risk"],
                    reason=a["reason"],
                    recommended_action=a["recommended_action"],
                    responsible_team=a["responsible_team"],
                    assigned_to=a["assigned_to"],
                    status=a["status"]
                )
                db.add(alt)
            db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed_database()
    print("Database initialization and national infrastructure seed completed.")
