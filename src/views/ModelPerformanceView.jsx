import React from 'react';
import { modelComparisonTable, featureEngineeringComparison, globalFeatureImportance } from '../data/modelMetricsData';
import { Cpu, Award, Layers, Sparkles } from 'lucide-react';
export const ModelPerformanceView = () => {
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Predictive ML Model Validation & Architecture
          </h1>
          <p className="page-subtitle">
            Cross-validation benchmarks, ROC-AUC evaluation, and CUF feature augmentation ablation metrics
          </p>
        </div>
      </div>

      {/* Champion Model Banner */}
      <div className="gov-card" style={{
            padding: '18px 22px',
            borderLeft: '4px solid var(--color-action-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
        }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={18} color="var(--color-action-primary)"/>
            <strong style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>
              Champion Production Model: LightGBM / XGBoost Ensemble (v2.4)
            </strong>
            <span style={{
            backgroundColor: 'var(--status-low-bg)',
            color: 'var(--status-low-text)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700
        }}>
              CHAMPION (AUC 0.958)
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Trained on historical MoSPI Central Sector projects and validated on active monthly reporting sequences with 5-fold stratified cross-validation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
          <div style={{ textAlign: 'center', background: 'var(--color-surface-elevated)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10.5px' }}>ROC-AUC</span>
            <strong className="tabular-nums" style={{ fontSize: '18px', color: 'var(--color-action-primary)' }}>0.958</strong>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--color-surface-elevated)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10.5px' }}>F1-Score</span>
            <strong className="tabular-nums" style={{ fontSize: '18px', color: 'var(--status-low-text)' }}>0.913</strong>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--color-surface-elevated)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10.5px' }}>Inference Latency</span>
            <strong className="tabular-nums" style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>14 ms</strong>
          </div>
        </div>
      </div>

      {/* Model Benchmark Matrix */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Cpu size={16} color="var(--color-action-primary)"/>
            Algorithmic Benchmark Matrix (Test Split: 20%)
          </div>
        </div>

        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th style={{ textAlign: 'center' }}>Accuracy</th>
                <th style={{ textAlign: 'center' }}>Precision</th>
                <th style={{ textAlign: 'center' }}>Recall</th>
                <th style={{ textAlign: 'center' }}>F1-Score</th>
                <th style={{ textAlign: 'center' }}>ROC-AUC</th>
                <th style={{ textAlign: 'center' }}>Training Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelComparisonTable.map((row) => (<tr key={row.modelName} style={{ backgroundColor: row.isBest ? 'var(--color-surface-hover)' : 'transparent' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.modelName}</div>
                  </td>
                  <td className="tabular-nums" style={{ textAlign: 'center' }}>{row.accuracy}</td>
                  <td className="tabular-nums" style={{ textAlign: 'center' }}>{row.precision}</td>
                  <td className="tabular-nums" style={{ textAlign: 'center' }}>{row.recall}</td>
                  <td className="tabular-nums" style={{ textAlign: 'center', fontWeight: 600, color: row.isBest ? 'var(--status-low-text)' : 'inherit' }}>
                    {row.f1Score}
                  </td>
                  <td className="tabular-nums" style={{ textAlign: 'center', fontWeight: 700, color: row.isBest ? 'var(--color-action-primary)' : 'inherit' }}>
                    {row.rocAuc}
                  </td>
                  <td className="tabular-nums" style={{ textAlign: 'center', color: 'var(--color-text-dim)' }}>
                    {row.trainingTimeSec ? `${row.trainingTimeSec}s` : '14 ms'}
                  </td>
                  <td>
                    <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: row.isBest ? 'var(--status-low-text)' : 'var(--color-text-dim)'
            }}>
                      {row.isBest ? 'Champion' : 'Benchmark'}
                    </span>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Engineering & Ablation Comparison */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px'
        }}>
        {/* CUF Baseline vs Engineered Feature Lift */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Sparkles size={16} color="var(--color-accent-cyan)"/>
              Feature Augmentation Ablation Lift
            </div>
          </div>
          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{featureEngineeringComparison.cufOnly.name} ({featureEngineeringComparison.cufOnly.variablesCount} variables)</strong>
                <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>ROC-AUC: {featureEngineeringComparison.cufOnly.rocAuc}</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: 'var(--color-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${featureEngineeringComparison.cufOnly.rocAuc * 100}%`, background: 'var(--color-text-muted)' }}/>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-action-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--color-accent-cyan)' }}>{featureEngineeringComparison.cufPlusAdditional.name} ({featureEngineeringComparison.cufPlusAdditional.variablesCount} variables)</strong>
                <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-action-primary)' }}>ROC-AUC: {featureEngineeringComparison.cufPlusAdditional.rocAuc} (+10.1% Lift)</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: 'var(--color-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${featureEngineeringComparison.cufPlusAdditional.rocAuc * 100}%`, background: 'var(--color-action-primary)' }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Global Feature Importance */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <Layers size={16} color="var(--color-action-primary)"/>
              Global Tree Feature Importance
            </div>
          </div>
          <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {globalFeatureImportance.map((item) => (<div key={item.feature}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.feature}</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {Math.round(item.importance * 100)}%
                  </span>
                </div>
                <div style={{ height: '4px', width: '100%', background: 'var(--color-surface-hover)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.importance * 100}%`, background: 'var(--color-action-primary)' }}/>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
