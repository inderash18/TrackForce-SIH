import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { SHAPExplanationChart } from '../components/charts/SHAPExplanationChart';
import { ProgressTimelineChart } from '../components/charts/ProgressTimelineChart';
import {
  Building2,
  Clock,
  Coins,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import type { RecommendedIntervention } from '../types/project';

export const ProjectDetailView: React.FC = () => {
  const { selectedProject, navigateTo, setSimulationParams, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'explainability' | 'interventions'>('overview');

  if (!selectedProject) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Project not found.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('projects')}>
          Back to Projects
        </button>
      </div>
    );
  }

  const p = selectedProject;

  const handleSimulateIntervention = (intItem: RecommendedIntervention) => {
    // Populate simulator with baseline + intervention improvements
    setSimulationParams({
      physicalProgress: p.physicalProgress,
      monthlyProgressRate: 2.8,
      fundingAvailability: 85,
      contractorCapacity: 75,
      landAcquisitionPct: Math.min(100, p.cuf.landAcquisitionPct + 15),
      clearanceSpeed: 80,
      resourceDeployment: 70
    });
    navigateTo('simulator');
    showNotification(`Transferred ${p.code} (${intItem.title}) to What-If Decision Lab for policy simulation.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Button & Master Header (Section 11) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigateTo('projects')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={13} /> Back to Projects Registry
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSimulationParams({
                physicalProgress: p.physicalProgress,
                monthlyProgressRate: 0.5,
                fundingAvailability: 60,
                contractorCapacity: p.cuf.contractorCapacity,
                landAcquisitionPct: p.cuf.landAcquisitionPct,
                clearanceSpeed: 50,
                resourceDeployment: 40
              });
              navigateTo('simulator');
            }}
          >
            <Sliders size={13} color="var(--color-royal-blue)" />
            Simulate Interventions
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              showNotification(`Generating MoSPI Project Dossier for ${p.code}...`);
              navigateTo('reports');
            }}
          >
            <FileText size={13} />
            Export Executive Dossier
          </button>
        </div>
      </div>

      {/* Top Project Master Card */}
      <div className="gov-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', background: 'var(--color-bg-soft)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border-grey)' }}>
                {p.code}
              </span>
              <StatusBadge level={p.riskLevel} />
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Confidence: <strong>{p.confidenceScore}% (High)</strong>
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-dark)', marginBottom: '10px', letterSpacing: '-0.01em' }}>
              {p.name}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} color="var(--color-royal-blue)" /> {p.ministry}
              </span>
              <span><strong>Sector:</strong> {p.sector}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {p.state} {p.district ? `(${p.district})` : ''}
              </span>
              <span><strong>Agency:</strong> {p.implementingAgency}</span>
            </div>
          </div>

          {/* Quick Score Highlight */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: p.riskLevel === 'critical' ? 'var(--status-critical-bg)' : 'var(--color-bg-soft)',
              border: `1px solid ${p.riskLevel === 'critical' ? 'var(--status-critical-border)' : 'var(--color-border-grey)'}`,
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              minWidth: '160px'
            }}
          >
            <span style={{ fontSize: '11px', color: p.riskLevel === 'critical' ? 'var(--status-critical-text)' : 'var(--color-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overall Risk Score
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: p.riskLevel === 'critical' ? 'var(--status-critical-text)' : 'var(--color-text-dark)', lineHeight: 1.1 }}>
              {p.riskScore} <span style={{ fontSize: '14px', fontWeight: 500, opacity: 0.7 }}>/ 100</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: p.riskLevel === 'critical' ? 'var(--status-critical-text)' : 'var(--status-medium-text)', textTransform: 'uppercase' }}>
              {p.riskLevel} Risk
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border-grey)', marginTop: '20px', paddingTop: '14px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            AI Predictive Overview
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'financial' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('financial')}
          >
            Cost & Financial Audit
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'explainability' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('explainability')}
          >
            SHAP Explainability AI ({p.shapContributors.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'interventions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('interventions')}
          >
            Actionable Interventions ({p.interventions.length})
          </button>
        </div>
      </div>

      {/* Primary KPI Predictions (Section 11) */}
      <div className="grid-cols-4">
        <MetricCard
          label="Cost Overrun Probability"
          value={`${p.costOverrunProbability}%`}
          explanation="Statistical likelihood of budget revision"
          trend={{ direction: 'up', text: 'High Exposure', isGood: false }}
          indicatorColor="critical"
        />
        <MetricCard
          label="Schedule Delay Probability"
          value={`${p.scheduleDelayProbability}%`}
          explanation="Likelihood of breaching approved target date"
          trend={{ direction: 'up', text: 'Severe Slippage', isGood: false }}
          indicatorColor="critical"
        />
        <MetricCard
          label="Expected Delay Drift"
          value={`+${p.expectedDelayMonths} mos`}
          explanation={`Expected completion: ${p.aiPredictedCompletionDate}`}
          trend={{ direction: 'up', text: `vs ${p.revisedCompletionDate}`, isGood: false }}
          indicatorColor="high"
        />
        <MetricCard
          label="Predicted Final Cost"
          value={`₹${p.predictedFinalCost.toLocaleString()} Cr`}
          explanation={`Escalation: +₹${p.costEscalationAmount} Cr over revised`}
          subtitleBadge={`Orig: ₹${p.originalCost} Cr`}
          indicatorColor="high"
        />
      </div>

      {/* Section 12 & 13: Financial Status & Schedule Timeline */}
      <div className="grid-2-1">
        {/* Schedule & Trend Velocity (Section 13 & 14) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <Clock size={16} color="var(--color-royal-blue)" />
                Schedule & Physical Progress Trajectory
              </div>
              <div className="gov-card-subtitle">Monthly execution velocity vs target milestone benchmarks</div>
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

        {/* Financial Status Comparison (Section 12) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <Coins size={16} color="var(--color-royal-blue)" />
                Cost & Financial Outlay
              </div>
              <div className="gov-card-subtitle">Approved budget vs AI escalation forecast</div>
            </div>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Original Sanctioned Cost</span>
                  <strong style={{ color: 'var(--color-text-dark)' }}>₹{p.originalCost.toLocaleString()} Cr</strong>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-bg-soft)', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${(p.originalCost / p.predictedFinalCost) * 100}%`, backgroundColor: '#94A3B8', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Approved Revised Cost</span>
                  <strong style={{ color: 'var(--color-text-dark)' }}>₹{p.revisedCost.toLocaleString()} Cr</strong>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-bg-soft)', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${(p.revisedCost / p.predictedFinalCost) * 100}%`, backgroundColor: 'var(--color-royal-blue)', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Current Expenditure</span>
                  <strong style={{ color: 'var(--color-text-dark)' }}>₹{p.expenditure.toLocaleString()} Cr ({((p.expenditure / p.revisedCost) * 100).toFixed(1)}%)</strong>
                </div>
                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-bg-soft)', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${(p.expenditure / p.predictedFinalCost) * 100}%`, backgroundColor: '#0EA5E9', borderRadius: '3px' }} />
                </div>
              </div>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)', borderRadius: 'var(--radius-md)', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--status-critical-text)', fontWeight: 700 }}>Predicted Final Cost (AI Model)</span>
                  <strong style={{ color: 'var(--status-critical-text)', fontSize: '13.5px' }}>₹{p.predictedFinalCost.toLocaleString()} Cr</strong>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--status-critical-text)', opacity: 0.9, display: 'block' }}>
                  Anticipated additional escalation: +₹{p.costEscalationAmount} Cr due to contractor idle claims & price index variation.
                </span>
              </div>
            </div>

            {/* CUF Indicators */}
            <div style={{ borderTop: '1px solid var(--color-border-grey)', paddingTop: '12px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block', marginBottom: '8px' }}>
                CUF Ground Variables
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div style={{ background: 'var(--color-bg-soft)', padding: '6px 8px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>Land Acquired</span>
                  <strong>{p.cuf.landAcquisitionPct}%</strong>
                </div>
                <div style={{ background: 'var(--color-bg-soft)', padding: '6px 8px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>Clearance Status</span>
                  <strong style={{ fontSize: '10.5px' }}>{p.cuf.clearanceStatus}</strong>
                </div>
                <div style={{ background: 'var(--color-bg-soft)', padding: '6px 8px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>Funding Status</span>
                  <strong>{p.cuf.fundingAvailability}</strong>
                </div>
                <div style={{ background: 'var(--color-bg-soft)', padding: '6px 8px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>Resource Deployment</span>
                  <strong style={{ color: 'var(--status-critical-text)' }}>{p.cuf.resourceDeployment}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 15 & 16: Explainable AI (SHAP) & Recommended Actions */}
      <div className="grid-2-1">
        {/* Explainable AI (Section 15) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <Sparkles size={16} color="var(--color-royal-blue)" />
                Why is this project high risk?
              </div>
              <div className="gov-card-subtitle">SHAP-style mathematical feature importance breakdown</div>
            </div>
          </div>

          <div className="gov-card-body">
            <SHAPExplanationChart
              contributors={p.shapContributors}
              projectRiskScore={p.riskScore}
            />
          </div>
        </div>

        {/* Recommended Actions (Section 16) */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <CheckCircle2 size={16} color="var(--status-low-dot)" />
                Recommended Interventions
              </div>
              <div className="gov-card-subtitle">AI-simulated high impact remedial actions</div>
            </div>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {p.interventions.map(action => (
              <div
                key={action.id}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${action.priority === 'CRITICAL' ? 'var(--status-critical-border)' : 'var(--color-border-grey)'}`,
                  backgroundColor: action.priority === 'CRITICAL' ? '#FEFBFB' : 'var(--color-white)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: action.priority === 'CRITICAL' ? 'var(--status-critical-bg)' : 'var(--status-medium-bg)',
                      color: action.priority === 'CRITICAL' ? 'var(--status-critical-text)' : 'var(--status-medium-text)'
                    }}
                  >
                    {action.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{action.id}</span>
                </div>

                <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)', display: 'block', marginBottom: '4px' }}>
                  {action.title}
                </strong>

                <p style={{ fontSize: '12px', color: 'var(--color-text-body)', margin: '0 0 8px', lineHeight: 1.35 }}>
                  <strong>Reason:</strong> {action.reason}
                </p>

                {/* Expected Impact Box */}
                <div
                  style={{
                    backgroundColor: 'var(--status-low-bg)',
                    border: '1px solid var(--status-low-border)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 700, display: 'block' }}>
                    Predicted Impact:
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--status-low-text)' }}>
                    {action.expectedImpact}
                  </span>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px', fontWeight: 600, color: 'var(--status-low-text)' }}>
                    <span>Delay Risk: {action.delayRiskBefore}% → {action.delayRiskAfter}%</span>
                    <span>Risk Score: {action.riskScoreBefore} → {action.riskScoreAfter}</span>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', fontSize: '11.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => handleSimulateIntervention(action)}
                >
                  <Sliders size={12} color="var(--color-royal-blue)" /> Test In What-If Simulator
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
