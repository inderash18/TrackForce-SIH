import React from 'react';
import { useApp } from '../context/AppContext';
import { sectorSummaryList, stateRiskBreakdown } from '../data/nationalMetrics';
import { RiskDriverBarChart } from '../components/charts/RiskDriverBarChart';
import { TrendingUp, Globe2, Layers } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { reportingMonth } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Infrastructure Portfolio Analytics</h1>
          <p className="page-hero-subtitle">
            Cross-sectional statistical distributions, state-level risk concentrations, and predictive delay models
          </p>
        </div>
      </div>

      {/* Grid 1: Sector Risk vs State Risk */}
      <div className="grid-cols-2">
        {/* Risk by Sector */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Layers size={16} color="var(--color-royal-blue)" />
              Risk Exposure by Sector
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{reportingMonth}</span>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sectorSummaryList.map(sec => (
              <div key={sec.sector}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-dark)' }}>{sec.sector}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>{sec.totalProjects} projects</span>
                    <strong style={{ color: sec.delayRiskAvg > 60 ? 'var(--status-critical-text)' : 'var(--color-text-dark)' }}>
                      {sec.delayRiskAvg}% delay risk
                    </strong>
                  </div>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'var(--color-bg-soft)', borderRadius: '3px', border: '1px solid var(--color-border-grey)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${sec.delayRiskAvg}%`,
                      backgroundColor: sec.delayRiskAvg > 60 ? 'var(--status-critical-dot)' : sec.delayRiskAvg > 40 ? 'var(--status-medium-dot)' : 'var(--status-low-dot)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk by State */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Globe2 size={16} color="var(--color-royal-blue)" />
              Top State Infrastructure Vulnerability
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Composite State Index</span>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stateRiskBreakdown.slice(0, 8).map(st => (
              <div key={st.state} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--color-bg-soft)', borderRadius: '6px', border: '1px solid var(--color-border-light)' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)', display: 'block' }}>{st.state}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{st.projects} projects ({st.criticalCount} critical)</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: st.avgRisk > 65 ? 'var(--status-critical-text)' : 'var(--color-text-dark)' }}>
                    {st.avgRisk} / 100
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Delay: {st.delayRisk}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid 2: Cost Overrun Distribution & Top Risk Drivers */}
      <div className="grid-2-1">
        {/* Cost & Delay Distributions */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <TrendingUp size={16} color="var(--color-royal-blue)" />
              Cost Overrun & Delay Probability Distribution
            </div>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '8px' }}>
                Cost Overrun Escalation Tiers (₹ Lakh Crore Exposure)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>No Escalation (0%)</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-low-text)' }}>984 projects</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>₹18.4 L Cr Outlay</span>
                </div>
                <div style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>1% - 15% Drift</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-medium-text)' }}>512 projects</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>₹11.2 L Cr Outlay</span>
                </div>
                <div style={{ padding: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>15% - 30% Escalation</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-high-text)' }}>301 projects</div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>₹8.1 L Cr Outlay</span>
                </div>
                <div style={{ padding: '10px', background: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--status-critical-text)', fontWeight: 600 }}>&gt; 30% Severe Escalation</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-critical-text)' }}>184 projects</div>
                  <span style={{ fontSize: '10.5px', color: 'var(--status-critical-text)' }}>₹5.08 L Cr Outlay</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-grey)', paddingTop: '14px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '6px' }}>
                Predictive Delay Duration Bands
              </span>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Statistical distribution indicates 613 projects facing timeline expansion, with the median delay concentrated at <strong>6.8 months</strong> for highway corridors and <strong>14.2 months</strong> for complex underground metro/tunnels.
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Risk Drivers */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">Top Portfolio Risk Drivers</div>
          </div>
          <div className="gov-card-body">
            <RiskDriverBarChart />
          </div>
        </div>
      </div>
    </div>
  );
};
