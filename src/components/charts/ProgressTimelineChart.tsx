import React, { useState } from 'react';
import type { MonthlyProgressPoint } from '../../types/project';
import { TrendingDown } from 'lucide-react';

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

  const maxExp = Math.max(...history.map(h => h.expenditure)) * 1.2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Metric Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn btn-sm ${activeMetric === 'progress' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveMetric('progress')}
          >
            Physical Progress (% vs Target)
          </button>
          <button
            className={`btn btn-sm ${activeMetric === 'expenditure' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveMetric('expenditure')}
          >
            Monthly Expenditure (₹ Cr)
          </button>
          <button
            className={`btn btn-sm ${activeMetric === 'risk' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveMetric('risk')}
          >
            Risk Score Velocity
          </button>
        </div>

        {/* Velocity Warning Badge */}
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
          <span>Execution velocity stalled (+0.5% in Apr 2026 vs 3.2% required)</span>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: '#FAFCFF',
          border: '1px solid var(--color-border-grey)',
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
                <line x1="45" y1={y} x2="580" y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                <text x="40" y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="Inter">
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
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="4,4"
                points={history
                  .map((h, i) => {
                    const x = 70 + i * (500 / (history.length - 1));
                    const y = 170 - (h.expectedProgress / 100) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Actual Physical Progress Line */}
              <polyline
                fill="none"
                stroke="var(--color-royal-blue)"
                strokeWidth="3"
                points={history
                  .map((h, i) => {
                    const x = 70 + i * (500 / (history.length - 1));
                    const y = 170 - (h.actualProgress / 100) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />

              {/* Data points */}
              {history.map((h, i) => {
                const x = 70 + i * (500 / (history.length - 1));
                const yActual = 170 - (h.actualProgress / 100) * 140;
                const isLatest = i === history.length - 1;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={yActual}
                      r={isLatest ? "6" : "4"}
                      fill={isLatest ? "var(--status-critical-dot)" : "var(--color-royal-blue)"}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={yActual - 10}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="700"
                      fill={isLatest ? "var(--status-critical-dot)" : "var(--color-text-dark)"}
                    >
                      {h.actualProgress}%
                    </text>
                    <text x={x} y="192" textAnchor="middle" fontSize="10.5" fill="#64748B" fontWeight="500">
                      {h.month.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Risk Score Path */}
          {activeMetric === 'risk' && (
            <>
              <polyline
                fill="none"
                stroke="var(--status-critical-dot)"
                strokeWidth="3"
                points={history
                  .map((h, i) => {
                    const x = 70 + i * (500 / (history.length - 1));
                    const y = 170 - (h.riskScore / 100) * 140;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {history.map((h, i) => {
                const x = 70 + i * (500 / (history.length - 1));
                const y = 170 - (h.riskScore / 100) * 140;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="var(--status-critical-dot)" stroke="#fff" strokeWidth="2" />
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--status-critical-dot)">
                      {h.riskScore}
                    </text>
                    <text x={x} y="192" textAnchor="middle" fontSize="10.5" fill="#64748B">
                      {h.month.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Expenditure Path */}
          {activeMetric === 'expenditure' && (
            <>
              {history.map((h, i) => {
                const x = 70 + i * (500 / (history.length - 1)) - 16;
                const barHeight = (h.expenditure / maxExp) * 140;
                const y = 170 - barHeight;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width="32" height={barHeight} fill="var(--color-navy-light)" rx="3" />
                    <text x={x + 16} y={y - 6} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-text-dark)">
                      ₹{h.expenditure}Cr
                    </text>
                    <text x={x + 16} y="192" textAnchor="middle" fontSize="10.5" fill="#64748B">
                      {h.month.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Milestone Comparison Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ padding: '10px 14px', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>Original Completion</span>
          <strong style={{ fontSize: '13.5px', color: 'var(--color-text-dark)' }}>{originalDate}</strong>
        </div>
        <div style={{ padding: '10px 14px', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>Approved Revised Target</span>
          <strong style={{ fontSize: '13.5px', color: 'var(--color-text-dark)' }}>{revisedDate}</strong>
        </div>
        <div style={{ padding: '10px 14px', background: 'var(--status-critical-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--status-critical-border)' }}>
          <span style={{ fontSize: '11px', color: 'var(--status-critical-text)', fontWeight: 600, display: 'block' }}>AI Predicted Completion</span>
          <strong style={{ fontSize: '13.5px', color: 'var(--status-critical-text)' }}>{aiPredictedDate} (+8.4 mos)</strong>
        </div>
      </div>
    </div>
  );
};
