import React from 'react';
import { modelComparisonTable, featureEngineeringComparison, globalFeatureImportance } from '../data/modelMetricsData';
import { Cpu, Award, Layers, CheckCircle2 } from 'lucide-react';

export const ModelPerformanceView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Predictive ML Model Validation & Architecture</h1>
          <p className="page-hero-subtitle">
            Cross-validation benchmarks, ROC-AUC evaluation, and CUF feature augmentation ablation metrics
          </p>
        </div>
      </div>

      {/* Best Model Banner */}
      <div
        className="gov-card"
        style={{
          padding: '20px 24px',
          backgroundColor: '#F8FAFC',
          borderLeft: '4px solid var(--color-royal-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={18} color="var(--color-royal-blue)" />
            <strong style={{ fontSize: '15px', color: 'var(--color-text-dark)' }}>
              Primary Production Classifier: XGBoost Ensemble (v2.4)
            </strong>
            <span
              style={{
                backgroundColor: 'var(--status-low-bg)',
                color: 'var(--status-low-text)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              BEST PERFORMER (AUC 0.894)
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>
            Trained on 14,280 historical Central Sector projects (2014-2025) and validated on 1,981 active CUF monthly reporting sequences with 5-fold stratified cross-validation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--color-border-grey)' }}>
            <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px' }}>ROC-AUC</span>
            <strong style={{ fontSize: '18px', color: 'var(--color-royal-blue)' }}>0.894</strong>
          </div>
          <div style={{ textAlign: 'center', background: '#fff', padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--color-border-grey)' }}>
            <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px' }}>F1-Score</span>
            <strong style={{ fontSize: '18px', color: 'var(--status-low-text)' }}>0.887</strong>
          </div>
          <div style={{ textAlign: 'center', background: '#fff', padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--color-border-grey)' }}>
            <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px' }}>Inference Latency</span>
            <strong style={{ fontSize: '18px', color: 'var(--color-text-dark)' }}>12 ms</strong>
          </div>
        </div>
      </div>

      {/* Model Comparison Table (Section 25) */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <div className="gov-card-title">
              <Cpu size={16} color="var(--color-royal-blue)" />
              Algorithmic Benchmark Matrix (Test Split: 20%)
            </div>
            <div className="gov-card-subtitle">Comparative evaluation across classification architectures</div>
          </div>
        </div>

        <div className="gov-table-container">
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
              {modelComparisonTable.map(row => (
                <tr key={row.modelName} style={{ backgroundColor: row.isBest ? 'var(--color-royal-blue-subtle)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {row.isBest && <CheckCircle2 size={15} color="var(--color-royal-blue)" />}
                      <strong style={{ color: row.isBest ? 'var(--color-royal-blue)' : 'var(--color-text-dark)', fontSize: '13px' }}>
                        {row.modelName}
                      </strong>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{(row.accuracy * 100).toFixed(1)}%</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{(row.precision * 100).toFixed(1)}%</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{(row.recall * 100).toFixed(1)}%</td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: row.isBest ? 'var(--color-royal-blue)' : 'inherit' }}>
                    {row.f1Score.toFixed(3)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: row.rocAuc >= 0.89 ? 'var(--status-low-text)' : 'inherit' }}>
                    {row.rocAuc.toFixed(3)}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>{row.trainingTimeSec}s</td>
                  <td>
                    {row.isBest ? (
                      <span className="status-badge low" style={{ background: 'var(--color-royal-blue)', color: '#fff', border: 'none' }}>
                        Active Production
                      </span>
                    ) : (
                      <span className="status-badge" style={{ background: 'var(--color-bg-soft)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border-grey)' }}>
                        Baseline Evaluated
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Engineering Ablation (CUF-only vs CUF + Additional Variables) */}
      <div className="grid-cols-2">
        {/* CUF-only Model */}
        <div className="gov-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Baseline Specification
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>14 Input Variables</span>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
            {featureEngineeringComparison.cufOnly.name}
          </h3>

          <p style={{ fontSize: '12px', color: 'var(--color-text-body)', marginBottom: '14px', lineHeight: 1.35 }}>
            {featureEngineeringComparison.cufOnly.notes}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-bg-soft)', padding: '10px 6px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>F1-Score</span>
              <strong style={{ fontSize: '18px', color: 'var(--color-text-dark)' }}>{featureEngineeringComparison.cufOnly.f1Score}</strong>
            </div>
            <div style={{ background: 'var(--color-bg-soft)', padding: '10px 6px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>ROC-AUC</span>
              <strong style={{ fontSize: '18px', color: 'var(--color-text-dark)' }}>{featureEngineeringComparison.cufOnly.rocAuc}</strong>
            </div>
            <div style={{ background: 'var(--color-bg-soft)', padding: '10px 6px', borderRadius: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>Accuracy</span>
              <strong style={{ fontSize: '18px', color: 'var(--color-text-dark)' }}>{(featureEngineeringComparison.cufOnly.accuracy * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* CUF + Additional Features */}
        <div className="gov-card" style={{ padding: '20px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 700, textTransform: 'uppercase' }}>
              PAIMANA Sentinel Engine
            </span>
            <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600 }}>42 Augmented Features</span>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-low-text)', marginBottom: '6px' }}>
            {featureEngineeringComparison.cufPlusAdditional.name}
          </h3>

          <p style={{ fontSize: '12px', color: 'var(--color-text-body)', marginBottom: '14px', lineHeight: 1.35 }}>
            {featureEngineeringComparison.cufPlusAdditional.notes}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: '#fff', padding: '10px 6px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
              <span style={{ fontSize: '11px', color: 'var(--status-low-text)', display: 'block', fontWeight: 600 }}>F1-Score (+0.126)</span>
              <strong style={{ fontSize: '18px', color: 'var(--status-low-text)' }}>{featureEngineeringComparison.cufPlusAdditional.f1Score}</strong>
            </div>
            <div style={{ background: '#fff', padding: '10px 6px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
              <span style={{ fontSize: '11px', color: 'var(--status-low-text)', display: 'block', fontWeight: 600 }}>ROC-AUC (+0.082)</span>
              <strong style={{ fontSize: '18px', color: 'var(--status-low-text)' }}>{featureEngineeringComparison.cufPlusAdditional.rocAuc}</strong>
            </div>
            <div style={{ background: '#fff', padding: '10px 6px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
              <span style={{ fontSize: '11px', color: 'var(--status-low-text)', display: 'block', fontWeight: 600 }}>Accuracy</span>
              <strong style={{ fontSize: '18px', color: 'var(--status-low-text)' }}>{(featureEngineeringComparison.cufPlusAdditional.accuracy * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Global Feature Importance Matrix */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Layers size={16} color="var(--color-royal-blue)" />
            Global Feature Importance (Tree Gain Attribution)
          </div>
        </div>

        <div className="gov-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {globalFeatureImportance.map((feat, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500, color: 'var(--color-text-dark)' }}>{feat.feature}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-royal-blue)' }}>{(feat.importance * 100).toFixed(1)}% Weight</span>
              </div>
              <div style={{ height: '6px', width: '100%', background: 'var(--color-bg-soft)', borderRadius: '3px', border: '1px solid var(--color-border-grey)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(feat.importance / 0.25) * 100}%`, backgroundColor: 'var(--color-royal-blue)', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
