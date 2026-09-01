import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  explanation: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
    isGood?: boolean; // If true, green, if false, red/amber
  };
  indicatorColor?: 'critical' | 'high' | 'medium' | 'low' | 'primary' | 'neutral';
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
  return (
    <div
      className="gov-card"
      style={{
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onClick}
    >
      {/* Subtle top indicator bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor:
            indicatorColor === 'critical'
              ? 'var(--status-critical-dot)'
              : indicatorColor === 'high'
              ? 'var(--status-high-dot)'
              : indicatorColor === 'medium'
              ? 'var(--status-medium-dot)'
              : indicatorColor === 'low'
              ? 'var(--status-low-dot)'
              : indicatorColor === 'primary'
              ? 'var(--color-royal-blue)'
              : 'transparent'
        }}
      />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.01em' }}>
            {label}
          </span>
          {icon && <div style={{ color: 'var(--color-text-secondary)', opacity: 0.8 }}>{icon}</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}>
            {value}
          </span>
          {subtitleBadge && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {subtitleBadge}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
            {trend.direction === 'up' && (
              <TrendingUp size={13} color={trend.isGood ? 'var(--status-low-dot)' : 'var(--status-critical-dot)'} />
            )}
            {trend.direction === 'down' && (
              <TrendingDown size={13} color={trend.isGood ? 'var(--status-low-dot)' : 'var(--status-critical-dot)'} />
            )}
            {trend.direction === 'neutral' && (
              <Minus size={13} color="var(--color-text-muted)" />
            )}
            <span
              style={{
                fontSize: '11.5px',
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
        <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', lineHeight: 1.35, margin: 0 }}>
          {explanation}
        </p>
      </div>
    </div>
  );
};
