import React from 'react';
import { IndiaRiskMap } from '../components/map/IndiaRiskMap';
import { stateRiskBreakdown } from '../data/nationalMetrics';
import { Layers } from 'lucide-react';

export const MapIntelligenceView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Geospatial Infrastructure Intelligence
          </h1>
          <p className="page-subtitle">
            Interactive GIS surveillance mapping of Central Sector infrastructure sites across India with CartoDB spatial layers
          </p>
        </div>
      </div>

      {/* Large GIS Map */}
      <IndiaRiskMap height="580px" showFiltersBar={true} />

      {/* State Risk Matrix Grid */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Layers size={16} color="var(--color-action-primary)" />
            State Infrastructure Density & Risk Index
          </div>
        </div>

        <div
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}
        >
          {stateRiskBreakdown.map((st) => (
            <div
              key={st.state}
              style={{
                padding: '10px 14px',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)', display: 'block' }}>{st.state}</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{st.projects} projects ({st.criticalCount} critical)</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: st.avgRisk > 65 ? 'var(--status-critical-text)' : 'var(--color-text-primary)'
                  }}
                >
                  {st.avgRisk} / 100
                </span>
                <span className="tabular-nums" style={{ fontSize: '10.5px', color: 'var(--color-text-dim)', display: 'block' }}>Delay: {st.delayRisk}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
