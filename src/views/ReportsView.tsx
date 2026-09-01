import React, { useState } from 'react';
import { standardReportsList } from '../data/reportsData';
import type { ReportItem } from '../data/reportsData';
import { useApp } from '../context/AppContext';
import {
  Download,
  Eye,
  FileSpreadsheet,
  X
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { showNotification, reportingMonth, user } = useApp();
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  const handleDownload = (rep: ReportItem, format: 'PDF' | 'XLSX') => {
    showNotification(`Downloading "${rep.title}" as ${format}...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Executive Dossiers & Statutory Reports</h1>
          <p className="page-hero-subtitle">
            Official infrastructure intelligence briefings generated for PMO, Cabinet Secretariat, and Inter-Ministerial Committees
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid-cols-2">
        {standardReportsList.map(rep => (
          <div
            key={rep.id}
            className="gov-card"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
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
                    backgroundColor: 'var(--color-bg-soft)',
                    border: '1px solid var(--color-border-grey)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {rep.category}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: rep.classification.includes('Cabinet') ? 'var(--status-critical-text)' : 'var(--color-royal-blue)'
                  }}
                >
                  {rep.classification}
                </span>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px', lineHeight: 1.3 }}>
                {rep.title}
              </h3>

              <p style={{ fontSize: '12px', color: 'var(--color-text-body)', margin: '0 0 12px', lineHeight: 1.35 }}>
                {rep.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                <span>Frequency: <strong>{rep.frequency}</strong></span>
                <span>Last Ingested: <strong>{rep.lastGenerated}</strong></span>
                <span>Pages: <strong>{rep.pages} pp</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => setPreviewReport(rep)}
                >
                  <Eye size={13} /> Preview
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleDownload(rep, 'PDF')}
                >
                  <Download size={13} /> PDF
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleDownload(rep, 'XLSX')}
                  title="Export Excel"
                >
                  <FileSpreadsheet size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
        >
          <div
            className="gov-card"
            style={{
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div className="gov-card-header" style={{ padding: '16px 24px', backgroundColor: 'var(--color-deep-navy)', color: '#fff' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Official Document Preview • {previewReport.classification}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '2px 0 0' }}>
                  {previewReport.title}
                </h3>
              </div>
              <button
                style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}
                onClick={() => setPreviewReport(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Mock Dossier Layout */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-body)' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--color-deep-navy)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                  Government of India • Ministry of Statistics and Programme Implementation
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Infrastructure and Project Monitoring Division (IPMD) • PAIMANA Sentinel AI System
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-deep-navy)', marginTop: '8px' }}>
                  {previewReport.title}
                </h2>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-royal-blue)' }}>
                  Reporting Period: {reportingMonth} | Clearance Level: {previewReport.classification}
                </span>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '8px' }}>
                1. Executive Summary & National Portfolio Pulse
              </h4>
              <p>
                During the month of {reportingMonth}, the Central Sector Infrastructure monitoring registry under PAIMANA tracked <strong>1,981 projects</strong> with an aggregate revised outlay of <strong>₹42.78 Lakh Crore</strong>. Cumulative expenditure stands at <strong>₹20.36 Lakh Crore (47.6%)</strong>.
              </p>
              <p>
                The Composite AI Portfolio Health Score is calibrated at <strong>72 / 100 (Needs Attention)</strong>, with <strong>184 projects categorized under Critical Risk</strong> and <strong>613 projects exhibiting statistically high schedule delay drift</strong>.
              </p>

              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-dark)', margin: '16px 0 8px' }}>
                2. Key Inter-Ministerial Escalation Highlights
              </h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
                <li><strong>Ministry of Railways:</strong> 52 critical projects; Himalayan fault line in Rishikesh-Karanprayag Rail Link (`PRJ-108273`) projecting +11.2 months completion drift.</li>
                <li><strong>Urban Development & Metro:</strong> Bengaluru Suburban Rail (`PRJ-992015`) requiring Cabinet Secretariat inter-ministerial resolution for 14 defense land parcels.</li>
                <li><strong>Roads & Highways:</strong> Mumbai-Vadodara Expressway (`PRJ-401182`) exhibiting 27% divergence in spending-to-physical progress.</li>
              </ul>

              <div style={{ background: 'var(--color-bg-soft)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)', fontSize: '12px' }}>
                <strong>Authorized Signatory:</strong> {user.name}, {user.role}, {user.department}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--color-border-grey)', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: 'var(--color-bg-soft)' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewReport(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => { handleDownload(previewReport, 'PDF'); setPreviewReport(null); }}>
                <Download size={14} /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
