import React from 'react';
export const StatusBadge = ({ level, size = 'md', showDot = true, customLabel, isPrediction = false }) => {
    const normalized = (level || '').toLowerCase();
    let badgeClass = 'badge-low';
    let defaultLabel = 'Low Risk';
    let dotColor = 'var(--status-low)';
    if (isPrediction || normalized.includes('predict') || normalized.includes('simulat') || normalized.includes('scenario')) {
        badgeClass = 'badge-prediction';
        defaultLabel = 'Predicted / AI';
        dotColor = 'var(--status-prediction)';
    }
    else if (normalized.includes('crit')) {
        badgeClass = 'badge-critical';
        defaultLabel = 'Critical Risk';
        dotColor = 'var(--status-critical)';
    }
    else if (normalized.includes('high')) {
        badgeClass = 'badge-high';
        defaultLabel = 'High Risk';
        dotColor = 'var(--status-high)';
    }
    else if (normalized.includes('med') || normalized.includes('mod')) {
        badgeClass = 'badge-medium';
        defaultLabel = 'Moderate Risk';
        dotColor = 'var(--status-medium)';
    }
    else if (normalized.includes('low') || normalized.includes('safe') || normalized.includes('healthy') || normalized.includes('on track')) {
        badgeClass = 'badge-low';
        defaultLabel = 'Low Risk';
        dotColor = 'var(--status-low)';
    }
    else if (normalized.includes('delay')) {
        badgeClass = 'badge-high';
        defaultLabel = 'Delayed';
        dotColor = 'var(--status-high)';
    }
    else if (normalized.includes('complet')) {
        badgeClass = 'badge-low';
        defaultLabel = 'Completed';
        dotColor = 'var(--status-low)';
    }
    const label = customLabel || defaultLabel;
    return (<span className={`badge-status ${badgeClass}`} style={{
            padding: size === 'sm' ? '2px 8px' : '3px 10px',
            fontSize: size === 'sm' ? '10.5px' : '11.5px',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600
        }}>
      {showDot && (<span style={{
                width: size === 'sm' ? '5px' : '6px',
                height: size === 'sm' ? '5px' : '6px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                display: 'inline-block'
            }}/>)}
      {label}
    </span>);
};
