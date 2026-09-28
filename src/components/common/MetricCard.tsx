import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  explanation: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
    isGood?: boolean;
  };
  indicatorColor?: 'critical' | 'high' | 'medium' | 'low' | 'primary' | 'prediction' | 'neutral';
  icon?: React.ReactNode;
  subtitleBadge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  explanation,
  trend,
  indicatorColor = 'neutral',
  icon,
  subtitleBadge,
  onClick
}) => {
  const getIndicatorColor = () => {
    switch (indicatorColor) {
      case 'critical':
        return 'var(--status-critical)';
      case 'high':
        return 'var(--status-high)';
      case 'medium':
        return 'var(--status-medium)';
      case 'low':
        return 'var(--status-low)';
      case 'prediction':
        return 'var(--status-prediction)';
      case 'primary':
        return 'var(--color-action-primary)';
      default:
        return 'var(--color-border-subtle)';
    }
  };

  return (
    <div
      className="gov-card"
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        background: 'var(--color-surface-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)'
      }}
      onClick={onClick}
    >
      {/* Top indicator bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: getIndicatorColor()
        }}
      />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', letterSpacing: '0.01em' }}>
            {label}
          </span>
          {icon && <div style={{ color: 'var(--color-text-muted)' }}>{icon}</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
          <span className="tabular-nums" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            {value}
          </span>
          {subtitleBadge && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {subtitleBadge}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            {trend.direction === 'up' && (
              <TrendingUp size={12} color={trend.isGood ? 'var(--status-low)' : 'var(--status-critical)'} />
            )}
            {trend.direction === 'down' && (
              <TrendingDown size={12} color={trend.isGood ? 'var(--status-low)' : 'var(--status-critical)'} />
            )}
            {trend.direction === 'neutral' && (
              <Minus size={12} color="var(--color-text-muted)" />
            )}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: trend.isGood
                  ? 'var(--status-low-text)'
                  : trend.isGood === false
                  ? 'var(--status-critical-text)'
                  : 'var(--color-text-secondary)'
              }}
            >
              {trend.text}
            </span>
          </div>
        )}
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.35, margin: 0 }}>
          {explanation}
        </p>
      </div>
    </div>
  );
};
