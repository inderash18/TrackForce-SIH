import React from 'react';
import type { ShapContributor } from '../../types/project';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface SHAPExplanationChartProps {
  contributors: ShapContributor[];
  projectRiskScore?: number;
}

export const SHAPExplanationChart: React.FC<SHAPExplanationChartProps> = ({
  contributors
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          Top Feature Attribution (SHAP Values)
        </span>
        <span style={{ fontSize: '11.5px', color: 'var(--color-royal-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Info size={13} /> XGBoost Ensemble Attribution
        </span>
      </div>

      {contributors.map((c, idx) => {
        const isWorsening = c.direction === 'increase';
        const barWidth = Math.min(100, Math.abs(c.contribution) * 2.8);

        return (
          <div
            key={idx}
            style={{
              padding: '12px 14px',
              backgroundColor: isWorsening ? '#FFFBFB' : '#F9FDFB',
              border: `1px solid ${isWorsening ? '#FEE4E2' : '#D1FADF'}`,
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isWorsening ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--status-critical-bg)',
                      color: 'var(--status-critical-text)',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    <ArrowUpRight size={12} /> +{Math.abs(c.contribution)}% Risk
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--status-low-bg)',
                      color: 'var(--status-low-text)',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    <ArrowDownRight size={12} /> -{Math.abs(c.contribution)}% Risk
                  </span>
                )}
                <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>{c.factor}</strong>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.03em'
                }}
              >
                {c.category}
              </span>
            </div>

            {/* Impact Horizontal Bar */}
            <div
              style={{
                height: '6px',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '3px',
                overflow: 'hidden',
                margin: '8px 0'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${barWidth}%`,
                  backgroundColor: isWorsening ? 'var(--status-critical-dot)' : 'var(--status-low-dot)',
                  borderRadius: '3px'
                }}
              />
            </div>

            {/* Plain Language Rationale */}
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-body)', lineHeight: 1.4 }}>
              {c.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
};
