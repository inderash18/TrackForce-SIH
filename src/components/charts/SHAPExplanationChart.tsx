import React from 'react';
import type { ShapContributor } from '../../types/project';
import { ArrowUpRight, ArrowDownRight, Cpu } from 'lucide-react';

interface SHAPExplanationChartProps {
  contributors: ShapContributor[];
  projectRiskScore?: number;
  modelVersion?: string;
}

export const SHAPExplanationChart: React.FC<SHAPExplanationChartProps> = ({
  contributors,
  modelVersion = 'LightGBM / TreeSHAP v2.4'
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Attribution Methodology Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--color-surface-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
          <Cpu size={13} color="var(--color-action-primary)" />
          <span>Attribution Model: <strong style={{ color: 'var(--color-text-primary)' }}>{modelVersion}</strong></span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Additive Feature Importance (TreeSHAP)
        </span>
      </div>

      {contributors.map((c, idx) => {
        const isWorsening = c.direction === 'increase' || (c as any).direction === 'increases_risk';
        const impactVal = Math.abs(c.contribution || (c as any).impact || 0);
        const barWidth = Math.min(100, impactVal * 3.2);

        return (
          <div
            key={idx}
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--color-surface-panel)',
              border: `1px solid ${isWorsening ? 'var(--status-critical-border)' : 'var(--status-low-border)'}`,
              borderRadius: 'var(--radius-md)',
              transition: 'all 150ms ease'
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
                    <ArrowUpRight size={12} /> +{impactVal} pts Risk
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
                    <ArrowDownRight size={12} /> -{impactVal} pts Risk
                  </span>
                )}
                <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                  {c.factor || (c as any).feature}
                </strong>
              </div>

              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dim)',
                  letterSpacing: '0.04em'
                }}
              >
                {c.category || 'MoSPI Risk Driver'}
              </span>
            </div>

            {/* Impact Horizontal Bar */}
            <div
              style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'var(--color-surface-hover)',
                borderRadius: '2px',
                overflow: 'hidden',
                margin: '6px 0 8px'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${barWidth}%`,
                  backgroundColor: isWorsening ? 'var(--status-critical)' : 'var(--status-low)',
                  borderRadius: '2px'
                }}
              />
            </div>

            {/* Plain Language Rationale */}
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              {c.explanation || (c as any).description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
