import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadarBenchmarkChart } from '../components/charts/RadarBenchmarkChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { GitCompare } from 'lucide-react';

export const BenchmarkingView: React.FC = () => {
  const { projects } = useApp();
  const [projectAId, setProjectAId] = useState<string>('PRJ-602096');
  const [projectBId, setProjectBId] = useState<string>('PRJ-108273');

  const projectA = projects.find(p => p.id === projectAId) || projects[0];
  const projectB = projects.find(p => p.id === projectBId) || projects[1];

  const radarMetricsA = {
    costGrowth: Math.min(100, (projectA.costEscalationAmount / projectA.revisedCost) * 400),
    scheduleDelay: projectA.scheduleDelayProbability,
    progressVelocity: Math.max(10, 100 - projectA.progressGap * 4),
    expenditureEfficiency: Math.min(100, (projectA.expenditure / projectA.revisedCost) * 120),
    riskScore: projectA.riskScore,
    clearanceFriction: 100 - projectA.cuf.landAcquisitionPct
  };

  const radarMetricsB = {
    costGrowth: Math.min(100, (projectB.costEscalationAmount / projectB.revisedCost) * 400),
    scheduleDelay: projectB.scheduleDelayProbability,
    progressVelocity: Math.max(10, 100 - projectB.progressGap * 4),
    expenditureEfficiency: Math.min(100, (projectB.expenditure / projectB.revisedCost) * 120),
    riskScore: projectB.riskScore,
    clearanceFriction: 100 - projectB.cuf.landAcquisitionPct
  };

  const sectorAvg = {
    costGrowth: 45,
    scheduleDelay: 58,
    progressVelocity: 65,
    expenditureEfficiency: 70,
    riskScore: 54,
    clearanceFriction: 35
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Project Peer Benchmarking Lab</h1>
          <p className="page-hero-subtitle">
            Comparative performance analytics against Sectoral and Inter-Ministerial historical baselines
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="gov-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Compare Project A:</span>
          <select
            className="gov-select"
            value={projectAId}
            onChange={e => setProjectAId(e.target.value)}
            style={{ fontWeight: 600, minWidth: '240px' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-royal-blue)' }}>
          <GitCompare size={20} />
          <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>VS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>Compare Project B:</span>
          <select
            className="gov-select"
            value={projectBId}
            onChange={e => setProjectBId(e.target.value)}
            style={{ fontWeight: 600, minWidth: '240px' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Radar Charts Grid */}
      <div className="grid-cols-2">
        {/* Project A Radar */}
        <div className="gov-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                {projectA.code} • {projectA.sector}
              </span>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--color-text-dark)' }}>
                {projectA.name}
              </h4>
            </div>
            <StatusBadge level={projectA.riskLevel} />
          </div>

          <RadarBenchmarkChart
            projectName={projectA.name}
            projectMetrics={radarMetricsA}
            sectorAvg={sectorAvg}
          />
        </div>

        {/* Project B Radar */}
        <div className="gov-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                {projectB.code} • {projectB.sector}
              </span>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--color-text-dark)' }}>
                {projectB.name}
              </h4>
            </div>
            <StatusBadge level={projectB.riskLevel} />
          </div>

          <RadarBenchmarkChart
            projectName={projectB.name}
            projectMetrics={radarMetricsB}
            sectorAvg={sectorAvg}
          />
        </div>
      </div>

      {/* Comparative Matrix Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">Side-by-Side Dimension Comparison</div>
        </div>

        <div className="gov-table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Evaluation Dimension</th>
                <th>{projectA.code} (Project A)</th>
                <th>{projectB.code} (Project B)</th>
                <th>Sector Average Baseline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Overall AI Risk Score</strong></td>
                <td><strong style={{ color: projectA.riskLevel === 'critical' ? 'var(--status-critical-text)' : 'inherit' }}>{projectA.riskScore} / 100</strong></td>
                <td><strong style={{ color: projectB.riskLevel === 'critical' ? 'var(--status-critical-text)' : 'inherit' }}>{projectB.riskScore} / 100</strong></td>
                <td>54 / 100</td>
              </tr>
              <tr>
                <td><strong>Sanctioned vs Revised Outlay</strong></td>
                <td>₹{projectA.originalCost} Cr → ₹{projectA.revisedCost} Cr</td>
                <td>₹{projectB.originalCost} Cr → ₹{projectB.revisedCost} Cr</td>
                <td>+14.2% Growth Avg</td>
              </tr>
              <tr>
                <td><strong>Physical Completion Progress</strong></td>
                <td>{projectA.physicalProgress}% (Gap: -{projectA.progressGap}%)</td>
                <td>{projectB.physicalProgress}% (Gap: -{projectB.progressGap}%)</td>
                <td>68.4% (Gap: -5.2%)</td>
              </tr>
              <tr>
                <td><strong>Schedule Delay Probability</strong></td>
                <td><span style={{ fontWeight: 700, color: 'var(--status-critical-text)' }}>{projectA.scheduleDelayProbability}%</span></td>
                <td><span style={{ fontWeight: 700, color: 'var(--status-critical-text)' }}>{projectB.scheduleDelayProbability}%</span></td>
                <td>58.0%</td>
              </tr>
              <tr>
                <td><strong>Anticipated Timeline Drift</strong></td>
                <td>+{projectA.expectedDelayMonths} months</td>
                <td>+{projectB.expectedDelayMonths} months</td>
                <td>+4.2 months</td>
              </tr>
              <tr>
                <td><strong>Land Acquisition %</strong></td>
                <td>{projectA.cuf.landAcquisitionPct}%</td>
                <td>{projectB.cuf.landAcquisitionPct}%</td>
                <td>88.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
