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
          <h1 className="page-hero-title">Geospatial Infrastructure Intelligence</h1>
          <p className="page-hero-subtitle">
            Interactive GIS surveillance mapping of Central Sector infrastructure sites across India
          </p>
        </div>
      </div>

      {/* Large Full-Screen Map */}
      <IndiaRiskMap height="600px" showFiltersBar={true} />

      {/* State Corridor Index */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Layers size={16} color="var(--color-royal-blue)" />
            State Infrastructure Density & Risk Index
          </div>
        </div>

        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {stateRiskBreakdown.map(st => (
            <div
              key={st.state}
              style={{
                padding: '10px 12px',
                background: 'var(--color-bg-soft)',
                borderRadius: '6px',
                border: '1px solid var(--color-border-grey)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)', display: 'block' }}>{st.state}</strong>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{st.projects} projects ({st.criticalCount} crit.)</span>
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: st.avgRisk > 65 ? 'var(--status-critical-text)' : 'var(--color-text-dark)'
                }}
              >
                {st.avgRisk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
