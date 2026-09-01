import React from 'react';
import type { RiskLevel } from '../../types/project';

interface StatusBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
  customLabel
}) => {
  const normalized = level.toLowerCase();
  
  let badgeClass = 'low';
  let defaultLabel = 'Safe / Low';

  if (normalized.includes('crit')) {
    badgeClass = 'critical';
    defaultLabel = 'Critical';
  } else if (normalized.includes('high')) {
    badgeClass = 'high';
    defaultLabel = 'High Risk';
  } else if (normalized.includes('med') || normalized.includes('mod')) {
    badgeClass = 'medium';
    defaultLabel = 'Medium Risk';
  } else if (normalized.includes('low') || normalized.includes('safe') || normalized.includes('healthy')) {
    badgeClass = 'low';
    defaultLabel = 'Low Risk';
  } else if (normalized.includes('ongoing')) {
    badgeClass = 'medium';
    defaultLabel = 'Ongoing';
  } else if (normalized.includes('delayed')) {
    badgeClass = 'high';
    defaultLabel = 'Delayed';
  }

  const label = customLabel || defaultLabel;

  return (
    <span
      className={`status-badge ${badgeClass}`}
      style={{
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        fontSize: size === 'sm' ? '11px' : '12px'
      }}
    >
      {showDot && <span className={`status-dot ${badgeClass}`} />}
      {label}
    </span>
  );
};
