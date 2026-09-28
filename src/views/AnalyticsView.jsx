import React from 'react';
import { useApp } from '../context/AppContext';
import { sectorSummaryList, stateRiskBreakdown } from '../data/nationalMetrics';
import { RiskDriverBarChart } from '../components/charts/RiskDriverBarChart';
import { TrendingUp, Globe2, Layers, BarChart2 } from 'lucide-react';
export const AnalyticsView = () => {
    const { reportingMonth } = useApp();
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Infrastructure Portfolio Analytics
          </h1>
          <p className="page-subtitle">
            Cross-sectional statistical distributions, state-level risk concentrations, and predictive delay models
          </p>
        </div>
      </div>

      {/* Grid 1: Sector Risk vs State Risk */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px'
        }}>
        {/* Risk by Sector */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Layers size={16} color="var(--color-action-primary)"/>
              Risk Exposure by Sector
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{reportingMonth}</span>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sectorSummaryList.map((sec) => (<div key={sec.sector}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{sec.sector}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>{sec.totalProjects} projects</span>
                    <strong style={{ color: sec.delayRiskAvg > 60 ? 'var(--status-critical-text)' : 'var(--color-text-primary)' }}>
                      {sec.delayRiskAvg}% delay risk
                    </strong>
                  </div>
                </div>
                <div style={{ height: '5px', width: '100%', background: 'var(--color-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                height: '100%',
                width: `${sec.delayRiskAvg}%`,
                backgroundColor: sec.delayRiskAvg > 60
                    ? 'var(--status-critical)'
                    : sec.delayRiskAvg > 40
                        ? 'var(--status-medium)'
                        : 'var(--status-low)',
                borderRadius: '3px'
            }}/>
                </div>
              </div>))}
          </div>
        </div>

        {/* Risk by State */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Globe2 size={16} color="var(--color-action-primary)"/>
              Top State Infrastructure Vulnerability
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Composite State Index</span>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stateRiskBreakdown.slice(0, 7).map((st) => (<div key={st.state} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
            }}>
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)', display: 'block' }}>{st.state}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{st.projects} projects ({st.criticalCount} critical)</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: st.avgRisk > 65 ? 'var(--status-critical-text)' : 'var(--color-text-primary)' }}>
                    {st.avgRisk} / 100
                  </div>
                  <span className="tabular-nums" style={{ fontSize: '10.5px', color: 'var(--color-text-dim)' }}>Delay: {st.delayRisk}%</span>
                </div>
              </div>))}
          </div>
        </div>
      </div>

      {/* Grid 2: Cost Overrun Distribution & Top Risk Drivers */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px'
        }}>
        {/* Cost & Delay Distributions */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <TrendingUp size={16} color="var(--color-action-primary)"/>
              Cost Overrun & Delay Probability Distribution
            </div>
          </div>
          <div className="gov-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Severe Cost Overrun Risk (&gt;50%)</div>
                <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-critical-text)', margin: '4px 0' }}>
                  18.4%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>365 mega projects affected</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Severe Schedule Slippage (&gt;12 mos)</div>
                <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-high-text)', margin: '4px 0' }}>
                  24.2%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>479 mega projects affected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Root Cause Factors */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <BarChart2 size={16} color="var(--color-accent-cyan)"/>
              National Risk Factor Decomposition (SHAP)
            </div>
          </div>
          <div className="gov-card-body" style={{ padding: '14px 18px' }}>
            <RiskDriverBarChart />
          </div>
        </div>
      </div>
    </div>);
};
