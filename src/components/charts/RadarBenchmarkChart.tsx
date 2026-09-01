import React from 'react';

interface RadarBenchmarkProps {
  projectName: string;
  projectMetrics: {
    costGrowth: number; // 0 - 100 normalized
    scheduleDelay: number;
    progressVelocity: number;
    expenditureEfficiency: number;
    riskScore: number;
    clearanceFriction: number;
  };
  sectorAvg: {
    costGrowth: number;
    scheduleDelay: number;
    progressVelocity: number;
    expenditureEfficiency: number;
    riskScore: number;
    clearanceFriction: number;
  };
}

export const RadarBenchmarkChart: React.FC<RadarBenchmarkProps> = ({
  projectName,
  projectMetrics,
  sectorAvg
}) => {
  const labels = [
    { label: 'Cost Growth Risk', key: 'costGrowth' as const },
    { label: 'Schedule Delay Drift', key: 'scheduleDelay' as const },
    { label: 'Progress Velocity', key: 'progressVelocity' as const },
    { label: 'Expenditure Alignment', key: 'expenditureEfficiency' as const },
    { label: 'Overall AI Risk', key: 'riskScore' as const },
    { label: 'Clearance Bottleneck', key: 'clearanceFriction' as const }
  ];

  const center = 150;
  const radius = 100;
  const numAxes = labels.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon points for Project
  const projectPoints = labels
    .map((l, i) => {
      const coords = getCoordinates(projectMetrics[l.key], i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Build polygon points for Sector Average
  const sectorPoints = labels
    .map((l, i) => {
      const coords = getCoordinates(sectorAvg[l.key], i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 300 300" style={{ width: '100%', maxWidth: '320px', height: 'auto', overflow: 'visible' }}>
        {/* Background concentric rings */}
        {[20, 40, 60, 80, 100].map(level => {
          const r = (level / 100) * radius;
          return (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray={level === 100 ? 'none' : '2,2'}
            />
          );
        })}

        {/* Axes lines */}
        {labels.map((_, i) => {
          const coords = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="#CBD5E1"
              strokeWidth="1"
            />
          );
        })}

        {/* Sector Average Polygon */}
        <polygon
          points={sectorPoints}
          fill="rgba(100, 116, 139, 0.15)"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Project Polygon */}
        <polygon
          points={projectPoints}
          fill="rgba(217, 45, 32, 0.22)"
          stroke="var(--status-critical-dot)"
          strokeWidth="2.5"
        />

        {/* Project Points */}
        {labels.map((l, i) => {
          const coords = getCoordinates(projectMetrics[l.key], i);
          return (
            <circle
              key={i}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill="var(--status-critical-dot)"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {labels.map((l, i) => {
          const coords = getCoordinates(118, i);
          return (
            <text
              key={i}
              x={coords.x}
              y={coords.y + 4}
              textAnchor={coords.x > center + 10 ? 'start' : coords.x < center - 10 ? 'end' : 'middle'}
              fontSize="9.5"
              fontWeight="600"
              fill="var(--color-text-dark)"
              fontFamily="Inter"
            >
              {l.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '18px', marginTop: '14px', fontSize: '11.5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--status-critical-dot)' }} />
          <strong style={{ color: 'var(--color-text-dark)' }}>{projectName.slice(0, 24)}...</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '2px', backgroundColor: '#64748B', borderStyle: 'dashed' }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>Sector Average</span>
        </div>
      </div>
    </div>
  );
};
