import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sectorSummaryList } from '../data/nationalMetrics';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const RiskMonitorView: React.FC = () => {
  const { projects, navigateToProject, reportingMonth } = useApp();
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('all');

  const criticalProjects = projects.filter(p => selectedRiskTier === 'all' || p.riskLevel === selectedRiskTier);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">National Risk Surveillance Monitor</h1>
          <p className="page-hero-subtitle">
            Comprehensive multi-sector risk heatmaps, critical delay clusters, and portfolio vulnerability surveillance
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="gov-select"
            value={selectedRiskTier}
            onChange={e => setSelectedRiskTier(e.target.value)}
          >
            <option value="all">All Active Risk Tiers (184 Critical)</option>
            <option value="critical">Critical Risk Only (Score &gt; 80)</option>
            <option value="high">High Risk Only (Score 60 - 80)</option>
            <option value="medium">Medium Risk (Score 40 - 60)</option>
          </select>
        </div>
      </div>

      {/* Sector Risk Vulnerability Matrix */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <div className="gov-card-title">
              <ShieldAlert size={16} color="var(--color-royal-blue)" />
              Sector-Wise Risk Exposure & Outlay Breakdown
            </div>
            <div className="gov-card-subtitle">Active surveillance across Central Infrastructure Sectors</div>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>Reporting: {reportingMonth}</span>
        </div>

        <div className="gov-table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Sector Name</th>
                <th style={{ textAlign: 'center' }}>Total Projects</th>
                <th style={{ textAlign: 'center' }}>Critical Risk Count</th>
                <th style={{ textAlign: 'center' }}>Avg Delay Risk</th>
                <th style={{ textAlign: 'right' }}>Cost Growth Drift</th>
                <th style={{ textAlign: 'right' }}>Sector Outlay</th>
                <th>Vulnerability Index</th>
              </tr>
            </thead>
            <tbody>
              {sectorSummaryList.map(sec => (
                <tr key={sec.sector}>
                  <td><strong style={{ color: 'var(--color-text-dark)' }}>{sec.sector}</strong></td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{sec.totalProjects}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: sec.criticalCount > 20 ? 'var(--status-critical-text)' : 'var(--color-text-dark)', fontWeight: 700 }}>
                      {sec.criticalCount}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{sec.delayRiskAvg}%</td>
                  <td style={{ textAlign: 'right', color: sec.costGrowthPct > 15 ? 'var(--status-critical-text)' : 'var(--color-text-dark)', fontWeight: 600 }}>
                    +{sec.costGrowthPct}%
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{sec.budgetLakhCr} L Cr</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--color-bg-soft)', borderRadius: '3px' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${sec.delayRiskAvg}%`,
                            backgroundColor: sec.delayRiskAvg > 60 ? 'var(--status-critical-dot)' : sec.delayRiskAvg > 40 ? 'var(--status-medium-dot)' : 'var(--status-low-dot)',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: sec.delayRiskAvg > 60 ? 'var(--status-critical-text)' : 'var(--color-text-dark)' }}>
                        {sec.delayRiskAvg > 60 ? 'High' : 'Moderate'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Projects Surveillance Registry */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <div className="gov-card-title">
              <AlertTriangle size={16} color="var(--status-critical-dot)" />
              High Vulnerability Project Surveillance Registry
            </div>
            <div className="gov-card-subtitle">Detailed telemetry of projects with acute timeline and expenditure drift</div>
          </div>
        </div>

        <div className="gov-table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Code & Name</th>
                <th>Ministry</th>
                <th>State</th>
                <th style={{ textAlign: 'center' }}>Risk Score</th>
                <th>Primary Root Cause</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {criticalProjects.map(p => (
                <tr key={p.id} className="interactive-row" onClick={() => navigateToProject(p.id)}>
                  <td>
                    <div>
                      <strong style={{ color: 'var(--color-text-dark)', fontSize: '13px', display: 'block' }}>{p.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{p.code} • {p.sector}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: '12px' }}>{p.ministry.replace('Ministry of ', '')}</span></td>
                  <td><span style={{ fontSize: '12.5px' }}>{p.state}</span></td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: p.riskLevel === 'critical' ? 'var(--status-critical-text)' : 'var(--status-high-text)' }}>
                      {p.riskScore} / 100
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-body)' }}>
                      {p.mainRiskReason}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigateToProject(p.id); }}>
                      Examine →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
