import React, { useState } from 'react';
import type { MonthlyProgressPoint } from '../../types/project';
import { TrendingDown, Calendar, AlertCircle, Sparkles } from 'lucide-react';

interface ProgressTimelineChartProps {
  history: MonthlyProgressPoint[];
  originalDate: string;
  revisedDate: string;
  aiPredictedDate: string;
}

export const ProgressTimelineChart: React.FC<ProgressTimelineChartProps> = ({
  history,
  originalDate,
  revisedDate,
  aiPredictedDate
}) => {
  const [activeMetric, setActiveMetric] = useState<'progress' | 'expenditure' | 'risk'>('progress');

  if (!history || history.length === 0) return null;

  const maxExp = Math.max(...history.map((h) => h.expenditure || 1000)) * 1.2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Metric Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={activeMetric === 'progress' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveMetric('progress')}
          >
            Physical Progress (% vs Target)
          </button>
          <button
            className={activeMetric === 'expenditure' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveMetric('expenditure')}
          >
            Monthly Expenditure (₹ Cr)
          </button>
          <button
            className={activeMetric === 'risk' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveMetric('risk')}
          >
            Risk Score Velocity
          </button>
        </div>

        {/* Milestone Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-critical-bg)',
            border: '1px solid var(--status-critical-border)',
            color: 'var(--status-critical-text)',
            fontSize: '11.5px',
            fontWeight: 600
          }}
        >
          <TrendingDown size={14} />
          <span>Physical progress lags scheduled milestone target by 17.5%</span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: 'var(--color-surface-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px 8px 10px',
          position: 'relative'
        }}
      >
        <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Horizontal Grid lines */}
          {[0, 25, 50, 75, 100].map((val, idx) => {
            const y = 170 - (val / 100) * 140;
            return (
              <g key={idx}>
                <line x1="45" y1={y} x2="580" y2={y} stroke="var(--color-border)" strokeDasharray="3,3" />
                <text x="40" y={y + 4} textAnchor="end" fontSize="10" fill="var(--color-text-dim)" fontFamily="Inter">
                  {activeMetric === 'expenditure' ? Math.round((val / 100) * maxExp) : `${val}%`}
                </text>
              </g>
            );
          })}

          {/* Progress Paths */}
          {activeMetric === 'progress' && (
            <>
              {/* Expected Target Line */}
              <polyline
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="2"
                strokeDasharray="4,4"
                points={history
                  .map((h, i) => {
                    const x = 60 + (i / Math.max(history.length - 1, 1)) * 500;
                    const y = 170 - ((h.expectedProgress || 0) / 100) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Actual Progress Line */}
              <polyline
                fill="none"
                stroke="var(--color-action-primary)"
                strokeWidth="3"
                points={history
                  .map((h, i) => {
                    const x = 60 + (i / Math.max(history.length - 1, 1)) * 500;
                    const y = 170 - ((h.actualProgress || 0) / 100) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Data points */}
              {history.map((h, i) => {
                const x = 60 + (i / Math.max(history.length - 1, 1)) * 500;
                const y = 170 - ((h.actualProgress || 0) / 100) * 140;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--color-action-primary)"
                    stroke="var(--color-surface-panel)"
                    strokeWidth="2"
                  />
                );
              })}
            </>
          )}

          {/* Risk Score Path */}
          {activeMetric === 'risk' && (
            <>
              <polyline
                fill="none"
                stroke="var(--status-critical)"
                strokeWidth="3"
                points={history
                  .map((h, i) => {
                    const x = 60 + (i / Math.max(history.length - 1, 1)) * 500;
                    const y = 170 - ((h.riskScore || 50) / 100) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {history.map((h, i) => {
                const x = 60 + (i / Math.max(history.length - 1, 1)) * 500;
                const y = 170 - ((h.riskScore || 50) / 100) * 140;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--status-critical)"
                    stroke="var(--color-surface-panel)"
                    strokeWidth="2"
                  />
                );
              })}
            </>
          )}

          {/* X Axis Labels */}
          {history.map((h, i) => {
            const x = 60 + (i / Math.max(history.length - 1, 1)) * 500;
            return (
              <text key={i} x={x} y="190" textAnchor="middle" fontSize="10.5" fill="var(--color-text-muted)" fontFamily="Inter">
                {h.month}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Completion Date Milestones Comparison */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: 'var(--color-surface-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
            Original Sanction Date
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} /> {originalDate}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
            Official Revised Target
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--status-high-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={13} /> {revisedDate}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: 'var(--status-prediction-text)', marginBottom: '3px', fontWeight: 600 }}>
            AI Predicted Completion
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--status-prediction-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--status-prediction)" /> {aiPredictedDate}
          </div>
        </div>
      </div>
    </div>
  );
};
