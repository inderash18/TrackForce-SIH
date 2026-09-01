import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const SimulatorView: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    simulationParams,
    simulationResult,
    runSimulation,
    resetSimulation,
    navigateToProject,
    navigateTo,
    showNotification
  } = useApp();

  const handleSliderChange = (field: keyof typeof simulationParams, value: number) => {
    const nextParams = { ...simulationParams, [field]: value };
    runSimulation(nextParams);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find(p => p.id === id);
    if (proj) {
      const newParams = {
        physicalProgress: proj.physicalProgress,
        monthlyProgressRate: 0.8,
        fundingAvailability: 60,
        contractorCapacity: proj.cuf.contractorCapacity,
        landAcquisitionPct: proj.cuf.landAcquisitionPct,
        clearanceSpeed: 50,
        resourceDeployment: 40
      };
      runSimulation(newParams);
    }
  };

  const handlePresetOptimal = () => {
    const optimalParams = {
      physicalProgress: selectedProject.physicalProgress,
      monthlyProgressRate: 3.2,
      fundingAvailability: 95,
      contractorCapacity: 85,
      landAcquisitionPct: 100,
      clearanceSpeed: 90,
      resourceDeployment: 85
    };
    runSimulation(optimalParams);
    showNotification('Applied "Optimal Inter-Ministerial Fast-Track" scenario.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">What-If Policy & Intervention Simulator</h1>
          <p className="page-hero-subtitle">
            Simulate policy interventions, land clearance resolutions, and funding adjustments to compute real-time risk reduction
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handlePresetOptimal}>
            <Sparkles size={13} color="var(--color-royal-blue)" />
            Apply Optimal Fast-Track Scenario
          </button>
          <button className="btn btn-secondary btn-sm" onClick={resetSimulation}>
            <RotateCcw size={13} />
            Reset to Baseline
          </button>
        </div>
      </div>

      {/* Target Project Selector Bar */}
      <div className="gov-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
            Select Active Target Project:
          </span>
          <select
            className="gov-select"
            value={selectedProjectId}
            onChange={e => handleProjectSelect(e.target.value)}
            style={{ fontWeight: 600, minWidth: '340px' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name} ({p.state})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <StatusBadge level={selectedProject.riskLevel} />
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigateToProject(selectedProject.id)}
          >
            Open Project Dossier →
          </button>
        </div>
      </div>

      {/* Main Split Grid (Left Controls | Right Predictions) */}
      <div className="grid-2-1">
        {/* Left Panel: Current Project Conditions & Sliders */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div className="gov-card-title">
                <Sliders size={16} color="var(--color-royal-blue)" />
                Intervention Levers & Ground Variables
              </div>
              <div className="gov-card-subtitle">Adjust execution parameters to simulate AI outcome trajectory</div>
            </div>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Slider 1: Monthly Progress Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  Monthly Execution Progress Velocity (% / month)
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>
                  {simulationParams.monthlyProgressRate}% / mo
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={simulationParams.monthlyProgressRate}
                onChange={e => handleSliderChange('monthlyProgressRate', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-royal-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                <span>0.2% (Severe Stagnation)</span>
                <span>Baseline: 0.5%</span>
                <span>5.0% (Fast Track)</span>
              </div>
            </div>

            {/* Slider 2: Land Acquisition % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  Land Acquisition & Right-of-Way Handover
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>
                  {simulationParams.landAcquisitionPct}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={simulationParams.landAcquisitionPct}
                onChange={e => handleSliderChange('landAcquisitionPct', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-royal-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                <span>40% (Major Dispute)</span>
                <span>Baseline: {selectedProject.cuf.landAcquisitionPct}%</span>
                <span>100% (Full RoW Cleared)</span>
              </div>
            </div>

            {/* Slider 3: Contractor Liquidity & Equipment Capacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  Contractor Financial Liquidity & Machine Capacity Index
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>
                  {simulationParams.contractorCapacity} / 100
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={simulationParams.contractorCapacity}
                onChange={e => handleSliderChange('contractorCapacity', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-royal-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                <span>20 (Distressed EPC)</span>
                <span>Baseline: {selectedProject.cuf.contractorCapacity}</span>
                <span>100 (Optimal Tier-1)</span>
              </div>
            </div>

            {/* Slider 4: Clearance Speed */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  Statutory & Forest Clearance Resolution Velocity
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>
                  {simulationParams.clearanceSpeed} / 100
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={simulationParams.clearanceSpeed}
                onChange={e => handleSliderChange('clearanceSpeed', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-royal-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                <span>10 (Nodal Stagnation)</span>
                <span>50 (Standard)</span>
                <span>100 (Cabinet Fast Track)</span>
              </div>
            </div>

            {/* Slider 5: Funding Availability */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                  Inter-Ministerial Tranche Disbursal Timeliness
                </label>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>
                  {simulationParams.fundingAvailability}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="5"
                value={simulationParams.fundingAvailability}
                onChange={e => handleSliderChange('fundingAvailability', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-royal-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                <span>30% (Severe Deficit)</span>
                <span>60% (Quarterly Delay)</span>
                <span>100% (Instant Release)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Side-by-Side Current vs Simulated Predictions (Section 17) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Estimated Delta Summary Card */}
          <div
            className="gov-card"
            style={{
              padding: '20px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle2 size={18} color="var(--status-low-dot)" />
              <strong style={{ fontSize: '14.5px', color: 'var(--status-low-text)' }}>
                Simulated Policy Impact Delta
              </strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600, display: 'block' }}>
                  Risk Score Reduction
                </span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-low-text)' }}>
                  -{simulationResult.riskReductionPoints} pts
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  Score drops to <strong>{simulationResult.simulatedRiskScore} / 100</strong>
                </span>
              </div>

              <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600, display: 'block' }}>
                  Expected Delay Saved
                </span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-low-text)' }}>
                  -{simulationResult.expectedDelayReductionMonths} mos
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  Recovers timeline slippage
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Container */}
          <div className="gov-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border-grey)', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--color-text-dark)' }}>
                Baseline vs Simulated Prediction
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Model: XGBoost v2.4 (94% Conf.)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Baseline Column */}
              <div style={{ padding: '14px', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Current Baseline
                </span>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Overall Risk Score</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-critical-text)' }}>
                    {simulationResult.baselineRiskScore} <span style={{ fontSize: '12px', fontWeight: 500 }}>/ 100</span>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Delay Probability</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                    {simulationResult.baselineDelayProbability}%
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Cost Risk Probability</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)' }}>
                    {simulationResult.baselineCostRisk}%
                  </div>
                </div>
              </div>

              {/* Simulated Column */}
              <div style={{ padding: '14px', background: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-low-text)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Simulated Outcome
                </span>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--status-low-text)' }}>Simulated Risk Score</span>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-low-text)' }}>
                    {simulationResult.simulatedRiskScore} <span style={{ fontSize: '12px', fontWeight: 500 }}>/ 100</span>
                  </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Delay Probability</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--status-low-text)' }}>
                    {simulationResult.simulatedDelayProbability}%
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Cost Risk Probability</span>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--status-low-text)' }}>
                    {simulationResult.simulatedCostRisk}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border-light)' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', fontSize: '12.5px' }}
                onClick={() => {
                  showNotification(`Generated policy memo for ${selectedProject.code} with simulated risk reduction (-${simulationResult.riskReductionPoints} pts).`);
                  navigateTo('reports');
                }}
              >
                Save as Inter-Ministerial Policy Memo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
