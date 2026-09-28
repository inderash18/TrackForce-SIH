import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { SHAPExplanationChart } from '../components/charts/SHAPExplanationChart';
import { ProgressTimelineChart } from '../components/charts/ProgressTimelineChart';
import {
  Building2,
  Clock,
  Sparkles,
  Sliders,
  FileText,
  MapPin,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import type { RecommendedIntervention } from '../types/project';

export const ProjectDetailView: React.FC = () => {
  const { selectedProject, navigateTo, setSimulationParams, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'explainability' | 'interventions'>('overview');

  if (!selectedProject) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '14px' }}>Project not found.</p>
        <button className="btn-primary" onClick={() => navigateTo('projects')}>
          Back to Projects Registry
        </button>
      </div>
    );
  }

  const p = selectedProject;

  const handleSimulateIntervention = (intItem: RecommendedIntervention) => {
    setSimulationParams({
      physicalProgress: p.physicalProgress,
      monthlyProgressRate: 2.5,
      fundingAvailability: 90,
      contractorCapacity: 80,
      landAcquisitionPct: Math.min(100, p.cuf.landAcquisitionPct + 15),
      clearanceSpeed: 85,
      resourceDeployment: 75
    });
    navigateTo('simulator');
    showNotification(`Loaded scenario for ${p.code}: "${intItem.title}" into What-If Simulator.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn-secondary"
          onClick={() => navigateTo('projects')}
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <ArrowLeft size={13} /> Back to Projects Registry
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => {
              setSimulationParams({
                physicalProgress: p.physicalProgress,
                monthlyProgressRate: 0.8,
                fundingAvailability: 70,
                contractorCapacity: p.cuf.contractorCapacity,
                landAcquisitionPct: p.cuf.landAcquisitionPct,
                clearanceSpeed: 50,
                resourceDeployment: 50
              });
              navigateTo('simulator');
            }}
          >
            <Sliders size={13} color="var(--color-accent-cyan)" />
            <span>Simulate Interventions</span>
          </button>
          <button
            className="btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => {
              showNotification(`Generating MoSPI Executive Briefing for ${p.code}...`);
              navigateTo('reports');
            }}
          >
            <FileText size={13} />
            <span>Export Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Project Master Intelligence Banner */}
      <div className="gov-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent-cyan)', background: 'var(--color-action-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                {p.code}
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                {p.sector} · {p.implementingAgency}
              </span>
            </div>

            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
              {p.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={13} color="var(--color-text-muted)" /> {p.ministry}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--color-text-muted)" /> {p.state}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="var(--color-text-muted)" /> Status: <strong>{p.status}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Risk Index</div>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: p.riskLevel.toLowerCase() === 'critical' ? 'var(--status-critical-text)' : 'var(--status-high-text)' }}>
                {p.riskScore} <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', fontWeight: 500 }}>/ 100</span>
              </div>
            </div>
            <StatusBadge level={p.riskLevel} size="md" />
          </div>
        </div>
      </div>

      {/* Key Predictive Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px'
        }}
      >
        <MetricCard
          label="Sanctioned vs Revised Outlay"
          value={`₹${p.revisedCost.toLocaleString('en-IN')} Cr`}
          explanation={`Original sanction: ₹${p.originalCost.toLocaleString('en-IN')} Cr (+${Math.round(((p.revisedCost - p.originalCost) / p.originalCost) * 100)}% cost growth)`}
          subtitleBadge={`Exp: ₹${p.expenditure.toLocaleString('en-IN')} Cr`}
          indicatorColor="primary"
        />
        <MetricCard
          label="Physical Completion"
          value={`${p.physicalProgress}%`}
          explanation={`Target was ${p.monthlyHistory[p.monthlyHistory.length - 1]?.expectedProgress || 70}% (gap of ${Math.round((p.monthlyHistory[p.monthlyHistory.length - 1]?.expectedProgress || 70) - p.physicalProgress)}%)`}
          trend={{ direction: 'down', text: 'Velocity 0.85%/mo', isGood: false }}
          indicatorColor={p.physicalProgress < 50 ? 'high' : 'medium'}
        />
        <MetricCard
          label="Predicted Delay Probability"
          value={`${p.scheduleDelayProbability}%`}
          explanation={`Model estimates approx ${p.expectedDelayMonths} months delay past revised completion`}
          indicatorColor="prediction"
        />
        <MetricCard
          label="Forecasted Final Cost"
          value={`₹${Math.round(p.revisedCost * 1.08).toLocaleString('en-IN')} Cr`}
          explanation={`Predicted cost escalation probability: ${p.costOverrunProbability}%`}
          indicatorColor="critical"
        />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '2px' }}>
        {[
          { id: 'overview', label: 'Overview & Schedule' },
          { id: 'explainability', label: 'Why is this Project High Risk? (SHAP)' },
          { id: 'interventions', label: 'Actionable Interventions' },
          { id: 'financial', label: 'CUF Statutory Parameters' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-action-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Schedule Timeline */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Clock size={15} color="var(--color-action-primary)" />
                Monthly Physical & Financial Trajectory
              </div>
            </div>
            <div className="gov-card-body">
              <ProgressTimelineChart
                history={p.monthlyHistory}
                originalDate={p.originalCompletionDate}
                revisedDate={p.revisedCompletionDate}
                aiPredictedDate={p.aiPredictedCompletionDate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Explainable AI (SHAP) */}
      {activeTab === 'explainability' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <Sparkles size={15} color="var(--color-accent-cyan)" />
                Why is this project classified as {p.riskLevel}?
              </div>
              <div className="gov-card-subtitle">
                TreeSHAP decomposition of exact feature weights influencing the composite risk score
              </div>
            </div>
          </div>
          <div className="gov-card-body">
            <SHAPExplanationChart contributors={p.shapContributors} projectRiskScore={p.riskScore} />
          </div>
        </div>
      )}

      {/* Tab 3: Actionable Interventions */}
      {activeTab === 'interventions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(p.recommendedInterventions || []).map((intItem) => (
            <div
              key={intItem.id}
              className="gov-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                borderLeft: intItem.priority === 'Critical' ? '4px solid var(--status-critical)' : '4px solid var(--status-high)'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <StatusBadge level={intItem.priority} size="sm" />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{intItem.pillar}</span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                  {intItem.title}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {intItem.description}
                </p>
                <div style={{ fontSize: '11.5px', color: 'var(--status-low-text)', fontWeight: 600, marginTop: '6px' }}>
                  Expected Outcome: {intItem.expectedImpact}
                </div>
              </div>

              <button
                className="btn-secondary"
                onClick={() => handleSimulateIntervention(intItem)}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                <Sliders size={13} color="var(--color-accent-cyan)" />
                <span>Simulate Policy Action</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Statutory CUF Parameters */}
      {activeTab === 'financial' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <ShieldCheck size={15} color="var(--color-action-primary)" />
              Central Upload Format (CUF) Compliance Matrix
            </div>
          </div>
          <div className="gov-card-body">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}
            >
              <div style={{ padding: '12px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Land Acquisition Complete</div>
                <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {p.cuf.landAcquisitionPct}%
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Forest Clearance Status</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: p.cuf.forestClearance === 'Approved' ? 'var(--status-low-text)' : 'var(--status-critical-text)' }}>
                  {p.cuf.forestClearance}
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Contractor Capacity Index</div>
                <div className="tabular-nums" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {p.cuf.contractorCapacity} / 100
                </div>
              </div>

              <div style={{ padding: '12px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Environment Clearance</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--status-low-text)' }}>
                  {p.cuf.environmentClearance}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
