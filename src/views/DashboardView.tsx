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
  Activity,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { projects, alerts, navigateToProject, navigateTo, showNotification, reportingMonth } = useApp();

  const [tableSearch] = useState('');
  const [selectedTableSector] = useState('all');

  const filteredEmergingProjects = projects.filter((p) => {
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

  const criticalProjectsCount = projects.filter((p) => (p.riskLevel || '').toLowerCase() === 'critical').length;
  const highRiskCount = projects.filter((p) => (p.riskLevel || '').toLowerCase() === 'high').length;

  const exportTableCSV = () => {
    const headers = [
      'Project Code',
      'Project Name',
      'Sector',
      'Ministry',
      'State',
      'Risk Score',
      'Cost Risk %',
      'Delay Risk %',
      'Progress %',
      'Status'
    ];
    const rows = filteredEmergingProjects.map((p) => [
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
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Section Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            National Infrastructure Intelligence
          </h1>
          <p className="page-subtitle">
            Predictive risk monitoring, delay forecasting, and early warning surveillance across Central Sector Projects (MoSPI IPMD)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => navigateTo('simulator')}>
            <Activity size={14} color="var(--color-accent-cyan)" />
            <span>Open Decision Simulator</span>
          </button>
          <button className="btn-primary" onClick={() => navigateTo('reports')}>
            <Download size={14} />
            <span>Monthly Cabinet Brief</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px'
        }}
      >
        <MetricCard
          label="Total Monitored Projects"
          value={projects.length}
          explanation="Active mega & major projects monitored in PAIMANA registry"
          trend={{ direction: 'neutral', text: '100% data coverage', isGood: true }}
          icon={<FolderGit2 size={16} />}
          indicatorColor="primary"
          onClick={() => navigateTo('projects')}
        />
        <MetricCard
          label="Cumulative Expenditure"
          value="₹48.2 L Cr"
          explanation="Against ₹138.5 Lakh Cr sanctioned revised outlay"
          subtitleBadge="Revised: ₹138.5 L Cr"
          trend={{ direction: 'up', text: '+₹1.4 L Cr this cycle', isGood: true }}
          icon={<Coins size={16} />}
          indicatorColor="primary"
        />
        <MetricCard
          label="Critical Risk Hotspots"
          value={criticalProjectsCount}
          explanation="Packages exhibiting acute milestone & RoW bottlenecks"
          subtitleBadge="Requires Cabinet Review"
          trend={{ direction: 'down', text: 'Down from 5 last cycle', isGood: true }}
          icon={<AlertTriangle size={16} />}
          indicatorColor="critical"
          onClick={() => navigateTo('alerts')}
        />
        <MetricCard
          label="Predicted Delay Exposure"
          value="34 Months"
          explanation="Weighted cumulative schedule slippage across high-risk corridors"
          trend={{ direction: 'up', text: '+4 mos variance', isGood: false }}
          icon={<Clock size={16} />}
          indicatorColor="prediction"
        />
      </div>

      {/* National Risk Map & Portfolio Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Geospatial Map */}
        <div style={{ minHeight: '440px' }}>
          <IndiaRiskMap height="440px" />
        </div>

        {/* National Risk Index & Portfolio Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Risk Gauge Card */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <ShieldCheck size={15} color="var(--color-action-primary)" />
                National Project Risk Index (NPRI)
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Reporting Cycle: {reportingMonth}
              </span>
            </div>
            <div className="gov-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--status-high-text)', letterSpacing: '-0.02em' }}>
                    58.4 <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Portfolio composite risk classified under <strong style={{ color: 'var(--status-high-text)' }}>Moderate-to-High</strong> surveillance tier.
                  </div>
                </div>

                <StatusBadge level="high" customLabel="Moderate-High" />
              </div>

              {/* Segmented Risk Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                  <span>Portfolio Risk Breakdown</span>
                  <span className="tabular-nums">{projects.length} Total Projects</span>
                </div>

                <div
                  style={{
                    height: '10px',
                    width: '100%',
                    display: 'flex',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-surface-hover)'
                  }}
                >
                  <div style={{ width: `${(criticalProjectsCount / projects.length) * 100}%`, backgroundColor: 'var(--status-critical)' }} title="Critical" />
                  <div style={{ width: `${(highRiskCount / projects.length) * 100}%`, backgroundColor: 'var(--status-high)' }} title="High" />
                  <div style={{ width: '35%', backgroundColor: 'var(--status-medium)' }} title="Moderate" />
                  <div style={{ width: '40%', backgroundColor: 'var(--status-low)' }} title="Low" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-dim)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-critical)' }} />
                    <span>Critical ({criticalProjectsCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-high)' }} />
                    <span>High ({highRiskCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-medium)' }} />
                    <span>Moderate</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-low)' }} />
                    <span>Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Risk Drivers */}
          <div className="gov-card" style={{ flex: 1 }}>
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Sparkles size={15} color="var(--color-accent-cyan)" />
                Top Root-Cause Delay Drivers (SHAP)
              </div>
              <button onClick={() => navigateTo('analytics')} className="btn-ghost" style={{ fontSize: '11px', padding: '2px 6px' }}>
                Full Analytics <ChevronRight size={12} />
              </button>
            </div>
            <div className="gov-card-body" style={{ padding: '14px 18px' }}>
              <RiskDriverBarChart />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Projects Table & Early Warnings Stream */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Critical & High Risk Projects Watchlist */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={15} color="var(--status-critical)" />
              <div>
                <div className="gov-card-title">High Risk Watchlist</div>
                <div className="gov-card-subtitle">Packages with acute delay and cost overrun probabilities</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={exportTableCSV} className="btn-secondary" style={{ fontSize: '11.5px', padding: '4px 10px' }}>
                <Download size={12} /> CSV
              </button>
              <button onClick={() => navigateTo('projects')} className="btn-ghost" style={{ fontSize: '11.5px', padding: '4px 8px' }}>
                View All <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="gov-table-wrapper" style={{ border: 'none' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Sector</th>
                  <th>Physical %</th>
                  <th>Delay Risk</th>
                  <th>Risk Index</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmergingProjects.slice(0, 5).map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {project.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {project.code} · {project.state}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {project.sector}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '45px', height: '5px', borderRadius: '3px', background: 'var(--color-surface-hover)', overflow: 'hidden' }}>
                          <div style={{ width: `${project.physicalProgress}%`, height: '100%', background: 'var(--color-action-primary)' }} />
                        </div>
                        <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 600 }}>
                          {project.physicalProgress}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 600, color: project.scheduleDelayProbability > 70 ? 'var(--status-critical-text)' : 'var(--status-high-text)' }}>
                        {project.scheduleDelayProbability}%
                      </span>
                    </td>
                    <td>
                      <StatusBadge level={project.riskLevel} customLabel={`${project.riskScore}/100`} size="sm" />
                    </td>
                    <td>
                      <button
                        onClick={() => navigateToProject(project.id)}
                        className="btn-ghost"
                        style={{ fontSize: '11.5px', padding: '3px 8px', color: 'var(--color-action-primary)' }}
                      >
                        Inspect <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Early Warning Signals */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={15} color="var(--status-high)" />
              <div>
                <div className="gov-card-title">Early Warning Surveillance</div>
                <div className="gov-card-subtitle">Algorithmic risk triggers from recent monthly updates</div>
              </div>
            </div>
            <button onClick={() => navigateTo('alerts')} className="btn-ghost" style={{ fontSize: '11.5px', padding: '4px 8px' }}>
              All Signals ({alerts.length}) <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px' }}>
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigateTo('alerts')}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'border-color 120ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <StatusBadge level={alert.severity} size="sm" />
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-dim)' }}>
                    {alert.timestamp || 'Fresh update'}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                  {alert.projectName}
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--color-text-secondary)', lineHeight: 1.35 }}>
                  {alert.reason || alert.aiExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
