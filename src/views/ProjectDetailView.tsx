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
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'costs' | 'explainability' | 'interventions'>('overview');

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
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '2px', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Summary' },
          { id: 'milestones', label: 'Progress & Milestones' },
          { id: 'costs', label: 'Costs & CUF Parameters' },
          { id: 'explainability', label: 'Risk & SHAP Explanation' },
          { id: 'interventions', label: 'Actions & History' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '9px 18px',
              background: activeTab === tab.id ? '#E0F2FE' : 'transparent',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #0284C7' : '2px solid transparent',
              color: activeTab === tab.id ? '#0F172A' : '#64748B',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Summary */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gov-card">
            <div className="gov-card-header" style={{ background: '#F8FAFC', padding: '14px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div className="gov-card-title" style={{ color: '#0F172A', fontWeight: 700, fontSize: '15px' }}>
                <Clock size={16} color="#0284C7" />
                Physical & Financial Progress Trajectory
              </div>
            </div>
            <div className="gov-card-body" style={{ padding: '20px' }}>
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

      {/* Tab 2: Progress & Milestones */}
      {activeTab === 'milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gov-card">
            <div className="gov-card-header" style={{ background: '#F8FAFC', padding: '14px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div className="gov-card-title" style={{ color: '#0F172A', fontWeight: 700, fontSize: '15px' }}>
                <Clock size={16} color="#0284C7" />
                Physical Work Breakdown & Critical Path Milestones
              </div>
            </div>
            <div className="gov-table-wrapper" style={{ border: 'none' }}>
              <table className="gov-table">
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                    <th>Milestone Name</th>
                    <th>Scheduled Baseline</th>
                    <th>Actual / Revised Date</th>
                    <th>Variance / Slippage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Right-of-Way Land Handover (Phase 1)', target: '2023-06-30', actual: '2023-09-15', variance: '+2.5 Mo', status: 'Completed' },
                    { name: 'Civil Viaduct & Pier Foundation Casting', target: '2024-03-31', actual: '2024-08-20', variance: '+4.7 Mo', status: 'Completed' },
                    { name: 'Superstructure Girders & Track Laying', target: '2025-06-30', actual: '2025-11-30', variance: '+5.0 Mo', status: 'Delayed' },
                    { name: 'Signalling & Traction Power Substation', target: '2026-03-31', actual: '2026-09-30', variance: '+6.0 Mo', status: 'In Progress' },
                    { name: 'Integrated Trial Runs & Safety Commissioner Inspection', target: '2026-08-31', actual: '2027-02-28', variance: '+6.0 Mo', status: 'Pending' }
                  ].map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{m.name}</td>
                      <td className="tabular-nums" style={{ fontSize: '12px', color: '#64748B' }}>{m.target}</td>
                      <td className="tabular-nums" style={{ fontSize: '12px', color: '#0F172A', fontWeight: 600 }}>{m.actual}</td>
                      <td>
                        <span style={{ fontSize: '11.5px', color: '#DC2626', background: '#FEE2E2', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {m.variance}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: m.status === 'Completed' ? '#DCFCE7' : m.status === 'Delayed' ? '#FEE2E2' : '#FEF3C7',
                          color: m.status === 'Completed' ? '#166534' : m.status === 'Delayed' ? '#991B1B' : '#92400E'
                        }}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Costs & CUF Parameters */}
      {activeTab === 'costs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gov-card">
            <div className="gov-card-header" style={{ background: '#F8FAFC', padding: '14px 20px', borderBottom: '1px solid #E2E8F0' }}>
              <div className="gov-card-title" style={{ color: '#0F172A', fontWeight: 700, fontSize: '15px' }}>
                <ShieldCheck size={16} color="#0284C7" />
                Central Upload Format (CUF) Financial & Statutory Compliance
              </div>
            </div>
            <div className="gov-card-body" style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px'
                }}
              >
                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Land Acquisition Status</div>
                  <div className="tabular-nums" style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
                    {p.cuf.landAcquisitionPct}%
                  </div>
                  <span style={{ fontSize: '11px', color: p.cuf.landAcquisitionPct >= 90 ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                    {p.cuf.landAcquisitionPct >= 90 ? '● Unrestricted Site Possession' : '▲ RoW Handover Pending'}
                  </span>
                </div>

                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Forest Clearance (MoEFCC)</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: p.cuf.forestClearance === 'Approved' ? '#16A34A' : '#DC2626', margin: '4px 0' }}>
                    {p.cuf.forestClearance}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Stage-II clearance order logged</span>
                </div>

                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Contractor Capacity Index</div>
                  <div className="tabular-nums" style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
                    {p.cuf.contractorCapacity} <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>/ 100</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>Tier-1 EPC consortium rating</span>
                </div>

                <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Environment & Coastal Reg.</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A', margin: '4px 0' }}>
                    {p.cuf.environmentClearance}
                  </div>
                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>● All environmental consents active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Risk & SHAP Explanation */}
      {activeTab === 'explainability' && (
        <div className="gov-card">
          <div className="gov-card-header" style={{ background: '#F8FAFC', padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <div>
              <div className="gov-card-title" style={{ color: '#0F172A', fontWeight: 700, fontSize: '15px' }}>
                <Sparkles size={16} color="#0284C7" />
                Why is this project classified as {p.riskLevel} Risk?
              </div>
              <div className="gov-card-subtitle" style={{ fontSize: '12px', color: '#64748B' }}>
                TreeSHAP decomposition of exact feature weights influencing the composite risk score
              </div>
            </div>
          </div>
          <div className="gov-card-body" style={{ padding: '20px' }}>
            <SHAPExplanationChart contributors={p.shapContributors} projectRiskScore={p.riskScore} />
          </div>
        </div>
      )}

      {/* Tab 5: Actions & History */}
      {activeTab === 'interventions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(p.recommendedInterventions || []).map((intItem) => (
            <div
              key={intItem.id}
              className="gov-card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                borderLeft: intItem.priority === 'Critical' ? '4px solid #DC2626' : '4px solid #F97316'
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <StatusBadge level={intItem.priority} size="sm" />
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>{intItem.pillar}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>
                  {intItem.title}
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', lineHeight: 1.45 }}>
                  {intItem.description}
                </p>
                <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600, marginTop: '6px' }}>
                  Expected Outcome: {intItem.expectedImpact}
                </div>
              </div>

              <button
                className="btn-secondary"
                onClick={() => handleSimulateIntervention(intItem)}
                style={{
                  fontSize: '12px',
                  padding: '8px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '8px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
                  cursor: 'pointer'
                }}
              >
                <Sliders size={13} color="#38BDF8" />
                <span>Simulate Policy Action</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
