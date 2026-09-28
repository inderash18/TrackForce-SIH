from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.core.database import get_db
from app.models.alert import EarlyWarningAlert
from app.models.user import User
from app.schemas.alert import AlertBase, AlertUpdate
from app.auth.rbac import get_optional_current_user, is_national_oversight_user, get_user_authorized_ministries, enforce_user_ministry_access

router = APIRouter(prefix="/alerts", tags=["Early Warnings"])

@router.get("", response_model=List[AlertBase])
def list_alerts(
    severity: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    sector: Optional[str] = None,
    ministry: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(EarlyWarningAlert)

    # Enforce server-side ministry scoping
    if current_user and not is_national_oversight_user(current_user):
        user_mins = get_user_authorized_ministries(current_user)
        if user_mins and user_mins != ["ALL"]:
            ministry_filters = [EarlyWarningAlert.ministry.ilike(f"%{m}%") for m in user_mins]
            query = query.filter(or_(*ministry_filters))
    elif ministry and ministry != "All Ministries":
        query = query.filter(EarlyWarningAlert.ministry == ministry)

    if severity and severity != "All":
        query = query.filter(EarlyWarningAlert.severity == severity)
    if status_filter and status_filter != "All":
        query = query.filter(EarlyWarningAlert.status == status_filter)
    if sector and sector != "All":
        query = query.filter(EarlyWarningAlert.sector == sector)
    
    alerts = query.order_by(desc(EarlyWarningAlert.timestamp)).all()
    def _val_alert(a):
        return AlertBase.model_validate(a) if hasattr(AlertBase, "model_validate") else AlertBase.from_orm(a)
    return [_val_alert(a) for a in alerts]

@router.patch("/{alert_id}", response_model=AlertBase)
def update_alert(
    alert_id: str,
    payload: AlertUpdate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(EarlyWarningAlert).filter(EarlyWarningAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Alert {alert_id} not found")
    
    if current_user and not enforce_user_ministry_access(current_user, alert.ministry):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Alert is outside your ministry scope")
    
    if payload.status:
        alert.status = payload.status
        if payload.status == "Resolved":
            alert.resolved_at = datetime.now(timezone.utc)
    if payload.assigned_to is not None:
        alert.assigned_to = payload.assigned_to
    if payload.resolution_notes is not None:
        alert.resolution_notes = payload.resolution_notes
    
    alert.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(alert)
    return AlertBase.model_validate(alert) if hasattr(AlertBase, "model_validate") else AlertBase.from_orm(alert)
