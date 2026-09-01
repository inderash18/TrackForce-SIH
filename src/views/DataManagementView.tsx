import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataQualityMetrics } from '../data/modelMetricsData';
import {
  Database,
  RefreshCw,
  Upload
} from 'lucide-react';

export const DataManagementView: React.FC = () => {
  const { showNotification } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showNotification('PAIMANA CUF and OCMS data synchronization completed. 1,981 records refreshed.');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Data Pipeline Management & Quality Assurance</h1>
          <p className="page-hero-subtitle">
            Ingestion feeds, CUF monthly reports synchronization, and automated data confidence diagnostics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleTriggerSync}
            disabled={isSyncing}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Synchronizing API Feeds...' : 'Trigger Immediate Pipeline Sync'}
          </button>
        </div>
      </div>

      {/* Section 24: Data Quality Monitoring Cards & Data Confidence Score */}
      <div className="grid-cols-4">
        <div className="gov-card" style={{ padding: '18px 20px', borderLeft: '4px solid var(--color-royal-blue)' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Data Confidence Score
          </span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-royal-blue)', margin: '4px 0' }}>
            {dataQualityMetrics.dataConfidenceScore} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>/ 100</span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--status-low-text)', fontWeight: 600 }}>
            ● High Integrity (Statistically Valid)
          </span>
        </div>

        <div className="gov-card" style={{ padding: '18px 20px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Completeness
          </span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-dark)', margin: '4px 0' }}>
            {dataQualityMetrics.completenessPct}%
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
            1,949 / 1,981 with full CUF fields
          </span>
        </div>

        <div className="gov-card" style={{ padding: '18px 20px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Consistency & Integrity
          </span>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-dark)', margin: '4px 0' }}>
            {dataQualityMetrics.consistencyPct}%
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
            0 duplicate records identified
          </span>
        </div>

        <div className="gov-card" style={{ padding: '18px 20px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
            Pipeline Freshness
          </span>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)', margin: '8px 0 4px' }}>
            {dataQualityMetrics.freshnessStatus}
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--status-low-text)', fontWeight: 600 }}>
            ● Live API Connection Active
          </span>
        </div>
      </div>

      {/* Section 23: Data Sources Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <div className="gov-card-title">
              <Database size={16} color="var(--color-royal-blue)" />
              Active Ingestion Data Sources & Connectors
            </div>
            <div className="gov-card-subtitle">Central Sector project databases contributing to predictive inference</div>
          </div>
        </div>

        <div className="gov-table-container">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Data Source Feed</th>
                <th>Format & Connector</th>
                <th>Records Ingested</th>
                <th>Completeness</th>
                <th>Last Ingested</th>
                <th>Validation Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PAIMANA Master Monthly Registry</strong></td>
                <td>Automated REST Sync</td>
                <td>1,981 projects</td>
                <td>98.4%</td>
                <td>Today, 18:14</td>
                <td><span className="status-badge low"><span className="status-dot low" /> Healthy</span></td>
              </tr>
              <tr>
                <td><strong>Common Utility Format (CUF) Telemetry</strong></td>
                <td>JSON Push / Monthly CSV</td>
                <td>1,981 projects</td>
                <td>96.8%</td>
                <td>01 Apr 2026</td>
                <td><span className="status-badge low"><span className="status-dot low" /> Validated</span></td>
              </tr>
              <tr>
                <td><strong>Historical OCMS Project Database (2014-2025)</strong></td>
                <td>PostgreSQL Lakehouse</td>
                <td>14,280 archived records</td>
                <td>99.1%</td>
                <td>Historical Snapshot</td>
                <td><span className="status-badge low"><span className="status-dot low" /> Synced</span></td>
              </tr>
              <tr>
                <td><strong>PARIVESH Environmental Clearances Feed</strong></td>
                <td>Inter-Ministerial API</td>
                <td>614 project matches</td>
                <td>94.2%</td>
                <td>Yesterday, 04:00</td>
                <td><span className="status-badge medium"><span className="status-dot medium" /> 12 Pending RoW</span></td>
              </tr>
              <tr>
                <td><strong>PFMS / e-Samiksha Disbursal Ledger</strong></td>
                <td>Treasury API Bridge</td>
                <td>1,981 projects</td>
                <td>99.6%</td>
                <td>Today, 12:00</td>
                <td><span className="status-badge low"><span className="status-dot low" /> Reconciled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Upload & Ingestion Sandbox */}
      <div className="gov-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
          Batch Data Ingestion & CUF File Upload
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Upload standardized CUF CSV/Excel files from implementing ministries for offline batch validation and predictive inference.
        </p>

        <div
          style={{
            border: '2px dashed var(--color-border-grey)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-soft)',
            cursor: 'pointer'
          }}
          onClick={() => showNotification('CUF template validation initiated. Mock dataset parsed successfully.')}
        >
          <Upload size={28} color="var(--color-royal-blue)" style={{ margin: '0 auto 10px' }} />
          <strong style={{ fontSize: '13.5px', color: 'var(--color-text-dark)', display: 'block' }}>
            Click to upload Monthly CUF / OCMS Report (.xlsx, .csv)
          </strong>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
            Automatic schema validation against MoSPI 42-variable specification
          </span>
        </div>
      </div>
    </div>
  );
};
