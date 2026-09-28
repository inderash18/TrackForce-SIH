import React from 'react';
import { nationalSummaryMetrics } from '../../data/nationalMetrics';
export const RiskDriverBarChart = () => {
    const drivers = nationalSummaryMetrics.topRiskDrivers;
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {drivers.map((item, idx) => {
            return (<div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-dark)' }}>
                {item.driver}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  {item.count} projects
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>
                  {item.percentage}%
                </span>
              </div>
            </div>

            {/* Horizontal Bar */}
            <div style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: 'var(--color-bg-soft)',
                    border: '1px solid var(--color-border-grey)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
              <div style={{
                    height: '100%',
                    width: `${(item.percentage / 30) * 100}%`,
                    maxWidth: '100%',
                    backgroundColor: idx === 0
                        ? 'var(--status-critical-dot)'
                        : idx === 1
                            ? 'var(--status-high-dot)'
                            : idx === 2
                                ? 'var(--status-medium-dot)'
                                : 'var(--color-royal-blue)',
                    borderRadius: '3px',
                    transition: 'width 300ms ease'
                }}/>
            </div>
          </div>);
        })}
    </div>);
};
