import React, { useState } from 'react';
import { Shield, Users, KeyRound, History } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');

  const mockUsers = [
    { id: 'USR-001', name: 'Dr. Rajiv Verma, IAS', role: 'MoSPI Administrator', dept: 'IPMD MoSPI', email: 'r.verma-ias@gov.in', status: 'Active' },
    { id: 'USR-002', name: 'S. N. Murthy', role: 'Ministry Officer', dept: 'Railway Board', email: 'sn.murthy@nic.in', status: 'Active' },
    { id: 'USR-003', name: 'V. Ramanathan', role: 'Project Administrator', dept: 'NHAI Regional HQ', email: 'v.ram@nhai.gov.in', status: 'Active' },
    { id: 'USR-004', name: 'Ananya Sen', role: 'Monitoring Analyst', dept: 'NITI Aayog / MoSPI', email: 'ananya.sen@gov.in', status: 'Active' },
    { id: 'USR-005', name: 'K. S. Narayanan', role: 'Read Only Viewer', dept: 'PMO Infrastructure Cell', email: 'ks.narayan@pmo.nic.in', status: 'Active' }
  ];

  const mockAuditLogs = [
    { id: 'LOG-8812', timestamp: 'Today, 19:45', user: 'Dr. Rajiv Verma, IAS', action: 'Approved Intervention Policy Memo for PRJ-602096', ip: '10.24.180.12 (Gov NICNet)' },
    { id: 'LOG-8811', timestamp: 'Today, 18:30', user: 'System Telemetry', action: 'Automated Ingestion: Ingested 1,981 CUF Records for April 2026', ip: '10.24.180.01' },
    { id: 'LOG-8810', timestamp: 'Today, 16:15', user: 'S. N. Murthy', action: 'Assigned Early Warning ALT-2026-0403 to RVNL Taskforce', ip: '10.24.192.44' },
    { id: 'LOG-8809', timestamp: 'Yesterday, 14:20', user: 'Ananya Sen', action: 'Exported National Infrastructure Risk Dossier (PDF)', ip: '10.24.180.89' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">System Administration & Access Governance</h1>
          <p className="page-hero-subtitle">
            Role-Based Access Control (RBAC), ministry officer provisioning, model governance, and statutory audit trails
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="gov-card" style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={13} /> Official User Directory ({mockUsers.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'roles' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('roles')}
        >
          <Shield size={13} /> Role Matrix & RBAC
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('audit')}
        >
          <History size={13} /> Statutory Audit Logs ({mockAuditLogs.length})
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">Provisioned Government Officers</div>
          </div>
          <div className="gov-table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Officer Name</th>
                  <th>Assigned Role</th>
                  <th>Department / Ministry</th>
                  <th>NIC Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-royal-blue)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.dept}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{u.email}</td>
                    <td><span className="status-badge low"><span className="status-dot low" /> {u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RBAC Roles */}
      {activeTab === 'roles' && (
        <div className="grid-cols-2">
          {[
            {
              role: 'MoSPI Administrator',
              desc: 'Full administrative access across all 1,981 central sector projects, model hyperparameters, RBAC, and policy overrides.',
              perms: ['Global Surveillance', 'Model Retraining & Calibration', 'Intervention Policy Clearance', 'User Management']
            },
            {
              role: 'Ministry Officer',
              desc: 'Read/Write access scoped to specific ministerial portfolio (e.g. Ministry of Railways, MoRTH).',
              perms: ['Portfolio Monitoring', 'Early Warning Directive Assignment', 'CUF Monthly Data Upload', 'Cabinet Report Export']
            },
            {
              role: 'Project Administrator',
              desc: 'Detailed telemetry management for designated project implementing agencies (e.g. NHAI, RVNL, MRVC).',
              perms: ['Single Project Field Updating', 'Milestone Reconciliation', 'Contractor Performance Logging']
            },
            {
              role: 'Monitoring Analyst & Read Only',
              desc: 'Analytical and inspection access for NITI Aayog, PMO, and parliamentary review committees.',
              perms: ['View All Dashboards', 'Run What-If Simulations', 'Download Executive Summaries']
            }
          ].map(r => (
            <div key={r.role} className="gov-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <KeyRound size={16} color="var(--color-royal-blue)" />
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>
                  {r.role}
                </h4>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-body)', marginBottom: '14px', lineHeight: 1.35 }}>
                {r.desc}
              </p>
              <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Permissions Scope:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {r.perms.map(p => (
                    <span key={p} style={{ fontSize: '11px', background: 'var(--color-bg-soft)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--color-border-grey)' }}>
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === 'audit' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">Immutable Security & Intervention Audit Trail</div>
          </div>
          <div className="gov-table-container">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>Officer Identity</th>
                  <th>Action Log Directive</th>
                  <th>Network Host</th>
                </tr>
              </thead>
              <tbody>
                {mockAuditLogs.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{l.id}</td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{l.timestamp}</td>
                    <td><strong>{l.user}</strong></td>
                    <td style={{ color: 'var(--color-text-dark)', fontSize: '12.5px' }}>{l.action}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--color-text-muted)' }}>{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
