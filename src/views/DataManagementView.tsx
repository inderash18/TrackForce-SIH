import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataQualityMetrics } from '../data/modelMetricsData';
import {
  Database,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const DataManagementView: React.FC = () => {
  const { showNotification } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showNotification('PAIMANA CUF and OCMS data synchronization completed. All records refreshed.');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Data Pipeline Management & Quality Assurance
          </h1>
          <p className="page-subtitle">
            Ingestion feeds, CUF monthly reports synchronization, and automated data confidence diagnostics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Synchronizing Feeds...' : 'Trigger Pipeline Sync'}</span>
          </button>
        </div>
      </div>

      {/* Data Quality Monitoring Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}
      >
        <div className="gov-card" style={{ padding: '16px 18px', borderLeft: '4px solid var(--color-action-primary)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Data Confidence Index
          </span>
          <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-action-primary)', margin: '4px 0' }}>
            {dataQualityMetrics.dataConfidenceScore} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-dim)' }}>/ 100</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600 }}>
            ● High Integrity (Statistically Valid)
          </span>
        </div>

        <div className="gov-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Completeness
          </span>
          <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', margin: '4px 0' }}>
            {dataQualityMetrics.completenessPct}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Complete CUF parameter coverage
          </span>
        </div>

        <div className="gov-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Consistency & Integrity
          </span>
          <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', margin: '4px 0' }}>
            {dataQualityMetrics.consistencyPct}%
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            0 duplicate records identified
          </span>
        </div>

        <div className="gov-card" style={{ padding: '16px 18px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Pipeline Freshness
          </span>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', margin: '8px 0 4px' }}>
            {dataQualityMetrics.freshnessStatus}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600 }}>
            ● Live Ingestion Feeds Connected
          </span>
        </div>
      </div>

      {/* Ingestion Data Sources Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            <Database size={16} color="var(--color-action-primary)" />
            Active MoSPI Infrastructure Ingestion Pipelines
          </div>
        </div>

        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Data Pipeline Source</th>
                <th>Protocol</th>
                <th>Last Ingestion Timestamp</th>
                <th>Completeness</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dataQualityMetrics.sources.map((src) => (
                <tr key={src.name}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{src.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{src.description}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-accent-cyan)', background: 'var(--color-action-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                      {src.type}
                    </span>
                  </td>
                  <td className="tabular-nums" style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {src.lastSync}
                  </td>
                  <td className="tabular-nums" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {src.completeness}%
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'var(--status-low-text)' }}>
                      <CheckCircle2 size={13} color="var(--status-low)" /> Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
