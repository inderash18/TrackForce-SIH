import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

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
    showNotification
  } = useApp();

  const handleSliderChange = (field: keyof typeof simulationParams, value: number) => {
    const nextParams = { ...simulationParams, [field]: value };
    runSimulation(nextParams);
  };

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    const proj = projects.find((p) => p.id === id);
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
      monthlyProgressRate: 3.0,
      fundingAvailability: 95,
      contractorCapacity: 85,
      landAcquisitionPct: 100,
      clearanceSpeed: 90,
      resourceDeployment: 85
    };
    runSimulation(optimalParams);
    showNotification('Applied "Optimal Inter-Ministerial Fast-Track" scenario.');
  };

  const p = selectedProject;
  const res = simulationResult;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            What-If Policy & Intervention Simulator
          </h1>
          <p className="page-subtitle">
            Simulate parameter perturbations (RoW clearances, contractor velocity, resource mobilization) to compute real-time risk reduction
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-secondary" onClick={handlePresetOptimal} style={{ fontSize: '12px' }}>
            <Sparkles size={13} color="var(--color-accent-cyan)" />
            <span>Optimal Fast-Track Preset</span>
          </button>
          <button className="btn-secondary" onClick={resetSimulation} style={{ fontSize: '12px' }}>
            <RotateCcw size={13} />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* Target Project Selection Bar */}
      <div
        className="gov-card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Target Project:
          </span>
          <select
            className="gov-select"
            value={selectedProjectId}
            onChange={(e) => handleProjectSelect(e.target.value)}
            style={{ fontWeight: 600, minWidth: '320px' }}
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.code} — {proj.name} ({proj.state})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Baseline Risk: <strong style={{ color: 'var(--status-critical-text)' }}>{p.riskScore}/100</strong>
          </span>
          <button
            onClick={() => navigateToProject(p.id)}
            className="btn-ghost"
            style={{ fontSize: '11.5px', padding: '3px 8px', color: 'var(--color-action-primary)' }}
          >
            View Dossier <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Controls vs Side-by-Side Intelligence */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Left Column: Input Sliders & Number Controls */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Sliders size={15} color="var(--color-action-primary)" />
              Simulation Parameter Adjustments
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Analytical Model v2.4
            </span>
          </div>

          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Control 1: Land Acquisition % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Land Acquisition & RoW Clearance
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={simulationParams.landAcquisitionPct}
                    onChange={(e) => handleSliderChange('landAcquisitionPct', Number(e.target.value))}
                    className="gov-input tabular-nums"
                    style={{ width: '60px', padding: '2px 6px', fontSize: '12px', textAlign: 'right' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simulationParams.landAcquisitionPct}
                onChange={(e) => handleSliderChange('landAcquisitionPct', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-action-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
                <span>Current: {p.cuf.landAcquisitionPct}%</span>
                <span>Full RoW: 100%</span>
              </div>
            </div>

            {/* Control 2: Monthly Progress Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Target Monthly Physical Progress Velocity
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={simulationParams.monthlyProgressRate}
                    onChange={(e) => handleSliderChange('monthlyProgressRate', Number(e.target.value))}
                    className="gov-input tabular-nums"
                    style={{ width: '60px', padding: '2px 6px', fontSize: '12px', textAlign: 'right' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>%/mo</span>
                </div>
              </div>
              <input
                type="range"
                step="0.1"
                min="0.1"
                max="5.0"
                value={simulationParams.monthlyProgressRate}
                onChange={(e) => handleSliderChange('monthlyProgressRate', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-action-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
                <span>Stalled: 0.2%/mo</span>
                <span>Fast-Track: 3.5%/mo</span>
              </div>
            </div>

            {/* Control 3: Contractor Execution Index */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Contractor Capacity & Machinery Deployment
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={simulationParams.contractorCapacity}
                    onChange={(e) => handleSliderChange('contractorCapacity', Number(e.target.value))}
                    className="gov-input tabular-nums"
                    style={{ width: '60px', padding: '2px 6px', fontSize: '12px', textAlign: 'right' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>pts</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={simulationParams.contractorCapacity}
                onChange={(e) => handleSliderChange('contractorCapacity', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-action-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--color-text-dim)', marginTop: '2px' }}>
                <span>Current: {p.cuf.contractorCapacity}/100</span>
                <span>Augmented: 90/100</span>
              </div>
            </div>

            {/* Control 4: Statutory Clearance Speed */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Statutory & Environmental Clearance Velocity
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={simulationParams.clearanceSpeed}
                    onChange={(e) => handleSliderChange('clearanceSpeed', Number(e.target.value))}
                    className="gov-input tabular-nums"
                    style={{ width: '60px', padding: '2px 6px', fontSize: '12px', textAlign: 'right' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>pts</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={simulationParams.clearanceSpeed}
                onChange={(e) => handleSliderChange('clearanceSpeed', Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-action-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Before vs After Delta Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Simulation Outcome Card */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Sparkles size={15} color="var(--status-prediction)" />
                Projected Impact & Risk Reduction
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--status-prediction-text)',
                  background: 'var(--status-prediction-bg)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600
                }}
              >
                {res.confidence}
              </span>
            </div>

            <div className="gov-card-body">
              {/* Comparative Numbers */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}
              >
                {/* Baseline Box */}
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    Current Baseline
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-critical-text)' }}>
                    {res.baselineRiskScore} <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', fontWeight: 500 }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Delay Probability: <strong>{res.baselineDelayProbability}%</strong>
                  </div>
                </div>

                {/* Simulated Box */}
                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid var(--status-prediction-border)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--status-prediction-text)', fontWeight: 600, marginBottom: '2px' }}>
                    Simulated Scenario
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--status-low-text)' }}>
                    {res.simulatedRiskScore} <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', fontWeight: 500 }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Delay Probability: <strong style={{ color: 'var(--status-low-text)' }}>{res.simulatedDelayProbability}%</strong>
                  </div>
                </div>
              </div>

              {/* Delta Reduction Summary Banner */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-surface-nav)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Total Risk Score Reduction
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-low-text)' }}>
                    -{res.riskReductionPoints} Points
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Delay Avoided
                  </div>
                  <div className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-accent-cyan)' }}>
                    ~{res.expectedDelayReductionMonths} Months
                  </div>
                </div>
              </div>

              {/* Policy Recommendations Trigger */}
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                Inter-ministerial action on RoW clearances and contractual milestone enforcement yields significant risk compression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
