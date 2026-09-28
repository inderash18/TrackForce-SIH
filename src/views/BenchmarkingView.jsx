import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadarBenchmarkChart } from '../components/charts/RadarBenchmarkChart';
import { StatusBadge } from '../components/common/StatusBadge';
import { GitCompare } from 'lucide-react';
export const BenchmarkingView = () => {
    const { projects } = useApp();
    const [projectAId, setProjectAId] = useState(projects[0]?.id || 'PRJ-2024-001');
    const [projectBId, setProjectBId] = useState(projects[1]?.id || 'PRJ-2024-002');
    const projectA = projects.find((p) => p.id === projectAId) || projects[0];
    const projectB = projects.find((p) => p.id === projectBId) || projects[1] || projects[0];
    const radarMetricsA = {
        costGrowth: Math.min(100, (projectA.costEscalationAmount / Math.max(projectA.revisedCost, 1)) * 400),
        scheduleDelay: projectA.scheduleDelayProbability,
        progressVelocity: Math.max(10, 100 - projectA.progressGap * 4),
        expenditureEfficiency: Math.min(100, (projectA.expenditure / Math.max(projectA.revisedCost, 1)) * 120),
        riskScore: projectA.riskScore,
        clearanceFriction: 100 - projectA.cuf.landAcquisitionPct
    };
    const radarMetricsB = {
        costGrowth: Math.min(100, (projectB.costEscalationAmount / Math.max(projectB.revisedCost, 1)) * 400),
        scheduleDelay: projectB.scheduleDelayProbability,
        progressVelocity: Math.max(10, 100 - projectB.progressGap * 4),
        expenditureEfficiency: Math.min(100, (projectB.expenditure / Math.max(projectB.revisedCost, 1)) * 120),
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
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Project Peer Benchmarking Lab
          </h1>
          <p className="page-subtitle">
            Side-by-side comparative diagnostics against Sectoral and Inter-Ministerial performance baselines
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="gov-card" style={{
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', minWidth: 0, width: '100%' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Project A:</span>
          <select className="gov-select" value={projectAId} onChange={(e) => setProjectAId(e.target.value)} style={{ fontWeight: 600, width: '100%', minWidth: 0 }}>
            {projects.map((p) => (<option key={p.id} value={p.id}>
                {p.code} — {p.name.slice(0, 28)}...
              </option>))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-cyan)' }}>
          <GitCompare size={18}/>
          <span style={{ fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>COMPARE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', minWidth: 0, width: '100%' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>Project B:</span>
          <select className="gov-select" value={projectBId} onChange={(e) => setProjectBId(e.target.value)} style={{ fontWeight: 600, width: '100%', minWidth: 0 }}>
            {projects.map((p) => (<option key={p.id} value={p.id}>
                {p.code} — {p.name.slice(0, 28)}...
              </option>))}
          </select>
        </div>
      </div>

      {/* Radar Comparison Grid */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '16px'
        }}>
        {/* Project A */}
        <div className="gov-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-action-primary)', fontWeight: 700 }}>
                PRIMARY BENCHMARK (A)
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {projectA.name}
              </h2>
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                {projectA.sector} · ₹{projectA.revisedCost.toLocaleString('en-IN')} Cr
              </div>
            </div>
            <StatusBadge level={projectA.riskLevel} customLabel={`${projectA.riskScore}/100`}/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarBenchmarkChart projectName={projectA.code} projectMetrics={radarMetricsA} sectorAvg={sectorAvg}/>
          </div>
        </div>

        {/* Project B */}
        <div className="gov-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-accent-cyan)', fontWeight: 700 }}>
                PEER COMPARISON (B)
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {projectB.name}
              </h2>
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                {projectB.sector} · ₹{projectB.revisedCost.toLocaleString('en-IN')} Cr
              </div>
            </div>
            <StatusBadge level={projectB.riskLevel} customLabel={`${projectB.riskScore}/100`}/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarBenchmarkChart projectName={projectB.code} projectMetrics={radarMetricsB} sectorAvg={sectorAvg}/>
          </div>
        </div>
      </div>
    </div>);
};
