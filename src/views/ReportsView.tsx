import React, { useState } from 'react';
import { standardReportsList } from '../data/reportsData';
import type { ReportItem } from '../data/reportsData';
import { useApp } from '../context/AppContext';
import {
  Download,
  Eye,
  X
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { showNotification, reportingMonth } = useApp();
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  const handleDownload = (rep: ReportItem, format: 'PDF' | 'XLSX') => {
    showNotification(`Exporting "${rep.title}" as ${format} package.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Executive Dossiers & Statutory Reports
          </h1>
          <p className="page-subtitle">
            Official infrastructure intelligence briefings generated for PMO, Cabinet Secretariat, and Inter-Ministerial Committees
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '16px'
        }}
      >
        {standardReportsList.map((rep) => (
          <div
            key={rep.id}
            className="gov-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--color-surface-elevated)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {rep.category}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: rep.classification.includes('Cabinet') ? 'var(--status-critical-text)' : 'var(--color-action-primary)'
                  }}
                >
                  {rep.classification}
                </span>
              </div>

              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>
                {rep.title}
              </h2>

              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {rep.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                <span>Frequency: <strong style={{ color: 'var(--color-text-secondary)' }}>{rep.frequency}</strong></span>
                <span>Generated: <strong style={{ color: 'var(--color-text-secondary)' }}>{rep.lastGenerated}</strong></span>
                <span>Pages: <strong style={{ color: 'var(--color-text-secondary)' }}>{rep.pages} pp</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: '12px', padding: '6px 10px', justifyContent: 'center' }}
                  onClick={() => setPreviewReport(rep)}
                >
                  <Eye size={13} /> <span>Preview</span>
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '12px', padding: '6px 10px', justifyContent: 'center' }}
                  onClick={() => handleDownload(rep, 'PDF')}
                >
                  <Download size={13} /> <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div
          className="drawer-backdrop"
          onClick={() => setPreviewReport(null)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '640px',
              maxWidth: '92vw',
              maxHeight: '85vh',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-elevated)',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-accent-cyan)', fontWeight: 600 }}>
                  {previewReport.category} · {previewReport.classification}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {previewReport.title}
                </h3>
              </div>
              <button onClick={() => setPreviewReport(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'var(--color-surface-panel)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                EXECUTIVE SUMMARY & MANDATE
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {previewReport.description} Prepared under the authority of MoSPI Infrastructure Monitoring Division for review period {reportingMonth}.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-secondary" onClick={() => setPreviewReport(null)}>
                Close Preview
              </button>
              <button className="btn-primary" onClick={() => handleDownload(previewReport, 'PDF')}>
                <Download size={14} /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
