import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { IndiaRiskMap } from '../components/map/IndiaRiskMap';
import { RiskDriverBarChart } from '../components/charts/RiskDriverBarChart';
import {
  FolderGit2,
  AlertTriangle,
  Clock,
  Coins,
  ShieldCheck,
  Download,
  Activity
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { projects, alerts, navigateToProject, navigateTo, showNotification, reportingMonth } = useApp();

  const [tableSearch, setTableSearch] = useState('');
  const [selectedTableSector] = useState('all');

  const filteredEmergingProjects = projects.filter(p => {
    if (selectedTableSector !== 'all' && p.sector !== selectedTableSector) return false;
    if (
      tableSearch &&
      !p.name.toLowerCase().includes(tableSearch.toLowerCase()) &&
      !p.code.toLowerCase().includes(tableSearch.toLowerCase()) &&
      !p.state.toLowerCase().includes(tableSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const exportTableCSV = () => {
    const headers = ['Project Code', 'Project Name', 'Sector', 'Ministry', 'State', 'Risk Score', 'Cost Risk %', 'Delay Risk %', 'Progress %', 'Status'];
    const rows = filteredEmergingProjects.map(p => [
      p.code,
      `"${p.name}"`,
      p.sector,
      `"${p.ministry}"`,
      p.state,
      p.riskScore,
      `${p.costOverrunProbability}%`,
      `${p.scheduleDelayProbability}%`,
      `${p.physicalProgress}%`,
      p.riskLevel
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAIMANA_Emerging_Risks_${reportingMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported Emerging Risk table as CSV.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Section Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">National Infrastructure Intelligence</h1>
          <p className="page-hero-subtitle">
            Predictive risk monitoring and early warning across 1,981 Central Sector Infrastructure Projects (MoSPI IPMD)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('simulator')}>
            <Activity size={14} color="var(--color-royal-blue)" />
            Open Decision Simulator
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('reports')}>
            <Download size={14} />
            Monthly Cabinet Brief
          </button>
        </div>
      </div>

      {/* Top KPI Cards (Section 4) */}
      <div className="grid-cols-4">
        <MetricCard
          label="Total Central Projects"
          value="1,981"
          explanation="Active projects monitored in PAIMANA master registry"
          trend={{ direction: 'neutral', text: '100% data coverage', isGood: true }}
          icon={<FolderGit2 size={18} />}
          indicatorColor="primary"
          onClick={() => navigateTo('projects')}
        />
        <MetricCard
          label="Cumulative Expenditure"
          value="₹20.36 L Cr"
          explanation="Out of ₹42.78 Lakh Cr approved revised outlay (47.6%)"
          subtitleBadge="Revised: ₹42.78 L Cr"
          trend={{ direction: 'up', text: '+₹0.42 L Cr this quarter', isGood: true }}
          icon={<Coins size={18} />}
          indicatorColor="neutral"
        />
        <MetricCard
          label="Critical Risk Projects"
          value="184"
          explanation="Immediate inter-ministerial intervention required"
          trend={{ direction: 'up', text: '+12 from last month', isGood: false }}
          icon={<AlertTriangle size={18} />}
          indicatorColor="critical"
          onClick={() => navigateTo('risk-monitor')}
        />
        <MetricCard
          label="Predicted Delay Projects"
          value="613"
          explanation="Likely to exceed approved revised completion target"
          trend={{ direction: 'up', text: '30.9% of portfolio', isGood: false }}
          icon={<Clock size={18} />}
          indicatorColor="high"
          onClick={() => navigateTo('analytics')}
        />
      </div>

      {/* National Risk Overview & Portfolio Health Score (Section 5) */}
      <div className="grid-1-2">
        {/* Left: Portfolio Health Score */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <ShieldCheck size={16} color="var(--color-royal-blue)" />
                Portfolio Health Score
              </div>
              <div className="gov-card-subtitle">AI Weighted Composite Integrity Index</div>
            </div>
            <StatusBadge level="medium" customLabel="Needs Attention" />
          </div>

          <div className="gov-card-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <svg width="150" height="150" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5EAF0" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--status-medium-dot)"
                  strokeWidth="10"
                  strokeDasharray="314.159"
                  strokeDashoffset={314.159 * (1 - 72 / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-dark)', lineHeight: 1 }}>
                  72
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                  / 100
                </span>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: '0 0 16px', lineHeight: 1.4 }}>
              Portfolio vulnerability is elevated due to stagnation clusters in metropolitan transit and Himalayan rail packages.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left', background: 'var(--color-bg-soft)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block' }}>Cost Risk Projects</span>
                <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>381 projects</strong>
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block' }}>Estimated Cost Drift</span>
                <strong style={{ fontSize: '13px', color: 'var(--status-critical-text)' }}>+₹5.65 L Cr</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Project Risk Distribution (Donut & Stacked Bars) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">Project Risk Distribution</div>
              <div className="gov-card-subtitle">Predictive classification across 1,981 projects</div>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
              Updated: {reportingMonth}
            </span>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Stacked Risk Progress Bar */}
            <div>
              <div
                style={{
                  height: '24px',
                  width: '100%',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div
                  style={{
                    width: `${(894 / 1981) * 100}%`,
                    backgroundColor: 'var(--status-low-dot)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                  title="Low Risk: 894 (45.1%)"
                >
                  45%
                </div>
                <div
                  style={{
                    width: `${(562 / 1981) * 100}%`,
                    backgroundColor: 'var(--status-medium-dot)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                  title="Medium Risk: 562 (28.4%)"
                >
                  28%
                </div>
                <div
                  style={{
                    width: `${(341 / 1981) * 100}%`,
                    backgroundColor: 'var(--status-high-dot)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                  title="High Risk: 341 (17.2%)"
                >
                  17%
                </div>
                <div
                  style={{
                    width: `${(184 / 1981) * 100}%`,
                    backgroundColor: 'var(--status-critical-dot)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                  title="Critical Risk: 184 (9.3%)"
                >
                  9%
                </div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'var(--status-low-bg)', border: '1px solid var(--status-low-border)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600 }}>Low / Safe</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-low-text)' }}>894</div>
                <span style={{ fontSize: '10.5px', color: 'var(--status-low-text)', opacity: 0.85 }}>45.1% of portfolio</span>
              </div>
              <div style={{ padding: '12px', background: 'var(--status-medium-bg)', border: '1px solid var(--status-medium-border)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--status-medium-text)', fontWeight: 600 }}>Medium Risk</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-medium-text)' }}>562</div>
                <span style={{ fontSize: '10.5px', color: 'var(--status-medium-text)', opacity: 0.85 }}>28.4% of portfolio</span>
              </div>
              <div style={{ padding: '12px', background: 'var(--status-high-bg)', border: '1px solid var(--status-high-border)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--status-high-text)', fontWeight: 600 }}>High Risk</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-high-text)' }}>341</div>
                <span style={{ fontSize: '10.5px', color: 'var(--status-high-text)', opacity: 0.85 }}>17.2% of portfolio</span>
              </div>
              <div style={{ padding: '12px', background: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', color: 'var(--status-critical-text)', fontWeight: 600 }}>Critical Risk</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-critical-text)' }}>184</div>
                <span style={{ fontSize: '10.5px', color: 'var(--status-critical-text)', opacity: 0.85 }}>9.3% of portfolio</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)', paddingTop: '10px' }}>
              <span>Primary Driver: <strong>Land Acquisition (27%)</strong> & <strong>Contractor Liquidity (21%)</strong></span>
              <button
                className="btn btn-sm"
                style={{ color: 'var(--color-royal-blue)', background: 'transparent', padding: 0 }}
                onClick={() => navigateTo('risk-monitor')}
              >
                View Risk Surveillance Matrix →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Geospatial Map (Section 6) */}
      <IndiaRiskMap height="460px" />

      {/* Top Emerging Risks Table (Section 7) */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <div className="gov-card-title">
              <AlertTriangle size={16} color="var(--status-critical-dot)" />
              Top Emerging Infrastructure Risks
            </div>
            <div className="gov-card-subtitle">
              Prioritized by AI Risk Severity, Physical Stagnation & Cost Overrun Probability
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Search table..."
              className="gov-input"
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              style={{ fontSize: '12px', padding: '4px 10px', width: '180px' }}
            />
            <button className="btn btn-secondary btn-sm" onClick={exportTableCSV}>
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <div className="gov-table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Code & Name</th>
                <th>Sector</th>
                <th>Ministry</th>
                <th>State</th>
                <th style={{ textAlign: 'center' }}>Risk Score</th>
                <th style={{ textAlign: 'center' }}>Cost Risk</th>
                <th style={{ textAlign: 'center' }}>Delay Risk</th>
                <th style={{ textAlign: 'center' }}>Progress</th>
                <th style={{ textAlign: 'center' }}>Trend</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmergingProjects.map(p => (
                <tr
                  key={p.id}
                  className="interactive-row"
                  onClick={() => navigateToProject(p.id)}
                >
                  <td>
                    <div>
                      <strong style={{ color: 'var(--color-text-dark)', fontSize: '13px', display: 'block' }}>
                        {p.name}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                        {p.code}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{p.sector}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {p.ministry.replace('Ministry of ', '')}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px' }}>{p.state}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color:
                          p.riskLevel === 'critical'
                            ? 'var(--status-critical-text)'
                            : p.riskLevel === 'high'
                            ? 'var(--status-high-text)'
                            : p.riskLevel === 'medium'
                            ? 'var(--status-medium-text)'
                            : 'var(--status-low-text)'
                      }}
                    >
                      {p.riskScore}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.costOverrunProbability}%</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.scheduleDelayProbability}%</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '12.5px' }}>{p.physicalProgress}%</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Target {p.expectedProgress}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        color:
                          p.riskTrend === 'worsening'
                            ? 'var(--status-critical-dot)'
                            : p.riskTrend === 'improving'
                            ? 'var(--status-low-dot)'
                            : 'var(--color-text-secondary)',
                        fontWeight: 700
                      }}
                    >
                      {p.riskTrend === 'worsening' ? '↑' : p.riskTrend === 'improving' ? '↓' : '→'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '11.5px' }}
                      onClick={e => {
                        e.stopPropagation();
                        navigateToProject(p.id);
                      }}
                    >
                      Examine
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Early Warning Signals & Risk Driver Analytics (Sections 8 & 9) */}
      <div className="grid-2-1">
        {/* Early Warning Signals (Section 8) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <Activity size={16} color="var(--status-critical-dot)" />
                Early Warning Signals
              </div>
              <div className="gov-card-subtitle">Real-time AI telemetry detecting velocity and spending deviations</div>
            </div>
            <button
              className="btn btn-sm"
              style={{ color: 'var(--color-royal-blue)', background: 'transparent' }}
              onClick={() => navigateTo('alerts')}
            >
              View All Alerts ({alerts.length}) →
            </button>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.slice(0, 3).map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${
                    alert.severity === 'critical'
                      ? 'var(--status-critical-border)'
                      : alert.severity === 'high'
                      ? 'var(--status-high-border)'
                      : 'var(--color-border-grey)'
                  }`,
                  backgroundColor: alert.severity === 'critical' ? '#FEFBFB' : '#FFFFFF',
                  cursor: 'pointer'
                }}
                onClick={() => navigateToProject(alert.projectId)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge level={alert.severity} size="sm" />
                    <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)' }}>
                      {alert.projectName}
                    </strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                    {alert.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--status-critical-text)', marginBottom: '4px' }}>
                  {alert.warningTitle}
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-text-body)', margin: '0 0 8px', lineHeight: 1.35 }}>
                  <strong>Reason:</strong> {alert.aiExplanation}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-light)', paddingTop: '6px' }}>
                  <span>Agency: {alert.responsibleAgency}</span>
                  <span style={{ color: 'var(--color-royal-blue)', fontWeight: 600 }}>Review Dossier →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Driver Analytics (Section 9) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">Top Portfolio Risk Drivers</div>
              <div className="gov-card-subtitle">Root causes across delayed schemes</div>
            </div>
          </div>

          <div className="gov-card-body">
            <RiskDriverBarChart />
          </div>
        </div>
      </div>
    </div>
  );
};
