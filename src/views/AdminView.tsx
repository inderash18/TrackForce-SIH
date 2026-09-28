import React, { useState } from 'react';
import { Shield, Users, History, CheckCircle2, Activity } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit' | 'health'>('users');

  const mockUsers = [
    { id: 'USR-001', name: 'Dr. Rajeshwar Rao', role: 'SUPER_ADMIN', dept: 'Infrastructure Monitoring Division (IMD)', email: 'admin@mospi.gov.in', status: 'Active' },
    { id: 'USR-002', name: 'Ananya Sengupta', role: 'MINISTRY_OFFICER', dept: 'Ministry of Railways', email: 'railways.officer@gov.in', status: 'Active' },
    { id: 'USR-003', name: 'Col. Hardeep Singh', role: 'MINISTRY_OFFICER', dept: 'Ministry of Road Transport & Highways', email: 'morth.officer@gov.in', status: 'Active' },
    { id: 'USR-004', name: 'Priya Nambiar', role: 'ANALYST', dept: 'MoSPI PAIMANA Predictive Cell', email: 'analyst@paimana.gov.in', status: 'Active' },
    { id: 'USR-005', name: 'K. S. Narayanan', role: 'VIEWER', dept: 'PMO Infrastructure Cell', email: 'ks.narayan@pmo.nic.in', status: 'Active' }
  ];

  const mockAuditLogs = [
    { id: 'LOG-8812', timestamp: 'Today, 19:45', user: 'Dr. Rajeshwar Rao', action: 'Approved Intervention Policy Memo for PRJ-2024-001', ip: '10.24.180.12 (Gov NICNet)' },
    { id: 'LOG-8811', timestamp: 'Today, 18:30', user: 'System Telemetry', action: 'Automated Ingestion: Refreshed CUF Records', ip: '10.24.180.01' },
    { id: 'LOG-8810', timestamp: 'Today, 16:15', user: 'Ananya Sengupta', action: 'Assigned Early Warning ALT-2026-001 to Land Taskforce', ip: '10.24.192.44' },
    { id: 'LOG-8809', timestamp: 'Yesterday, 14:20', user: 'Priya Nambiar', action: 'Exported National Infrastructure Risk Dossier (CSV)', ip: '10.24.180.89' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            System Administration & Access Governance
          </h1>
          <p className="page-subtitle">
            Role-Based Access Control (RBAC), ministry officer provisioning, model governance, and statutory audit trails
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="gov-card"
        style={{
          padding: '10px 14px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        <button
          className={activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '5px 12px' }}
          onClick={() => setActiveTab('users')}
        >
          <Users size={13} /> Official User Directory ({mockUsers.length})
        </button>
        <button
          className={activeTab === 'roles' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '5px 12px' }}
          onClick={() => setActiveTab('roles')}
        >
          <Shield size={13} /> Role Matrix & Permissions
        </button>
        <button
          className={activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '5px 12px' }}
          onClick={() => setActiveTab('audit')}
        >
          <History size={13} /> Audit Trail ({mockAuditLogs.length})
        </button>
        <button
          className={activeTab === 'health' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '12px', padding: '5px 12px' }}
          onClick={() => setActiveTab('health')}
        >
          <Activity size={13} /> System Health & Telemetry
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">Provisioned Government Officers</div>
          </div>
          <div className="gov-table-wrapper" style={{ border: 'none' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Officer Name</th>
                  <th>Assigned Role</th>
                  <th>Department / Ministry</th>
                  <th>Gov Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="tabular-nums" style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {u.id}
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{u.name}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-accent-cyan)', background: 'var(--color-action-subtle)', padding: '2px 8px', borderRadius: '4px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{u.dept}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{u.email}</td>
                    <td>
                      <StatusBadge level="low" customLabel={u.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RBAC Roles Matrix */}
      {activeTab === 'roles' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {[
            {
              role: 'SUPER_ADMIN / MoSPI Apex',
              permissions: ['Full Portfolio Read/Write', 'What-If Simulation Override', 'Statutory Flash Report Generation', 'User & Key Governance', 'Model Calibration'],
              usersCount: '1 Officer'
            },
            {
              role: 'MINISTRY_OFFICER',
              permissions: ['Line Ministry Dossier Access', 'Early Warning Acknowledgment & Resolution', 'Milestone Anomaly Submission', 'What-If Lab Access'],
              usersCount: '2 Officers'
            },
            {
              role: 'ANALYST',
              permissions: ['Read-only Portfolio Analytics', 'Model Performance Inspection', 'CSV Data Export', 'AI Assistant Querying'],
              usersCount: '1 Officer'
            },
            {
              role: 'VIEWER (Cabinet & PMO)',
              permissions: ['Executive Dashboard Surveillance', 'National Project Risk Index Review', 'Executive PDF Dossier Download'],
              usersCount: '1 Officer'
            }
          ].map((r) => (
            <div key={r.role} className="gov-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {r.role}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{r.usersCount}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {r.permissions.map((perm) => (
                  <div key={perm} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle2 size={13} color="var(--status-low)" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs */}
      {activeTab === 'audit' && (
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">Immutable System Audit Trail</div>
          </div>
          <div className="gov-table-wrapper" style={{ border: 'none' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Timestamp</th>
                  <th>User Identity</th>
                  <th>Action Directive</th>
                  <th>Origin IP</th>
                </tr>
              </thead>
              <tbody>
                {mockAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="tabular-nums" style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{log.id}</td>
                    <td className="tabular-nums" style={{ color: 'var(--color-text-secondary)' }}>{log.timestamp}</td>
                    <td><strong style={{ color: 'var(--color-text-primary)' }}>{log.user}</strong></td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{log.action}</td>
                    <td className="tabular-nums" style={{ color: 'var(--color-text-dim)', fontSize: '11.5px' }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Health */}
      {activeTab === 'health' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px'
          }}
        >
          <div className="gov-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>FastAPI Gateway</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-low-text)', margin: '4px 0' }}>Operational</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>Avg latency: 22ms</div>
          </div>
          <div className="gov-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>PostgreSQL & pgvector</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-low-text)', margin: '4px 0' }}>Connected</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>Pool size: 20 connections</div>
          </div>
          <div className="gov-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>ML Ensemble Inference</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-low-text)', margin: '4px 0' }}>Champion (v2.4)</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>LightGBM + TreeSHAP</div>
          </div>
          <div className="gov-card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Celery Background Queue</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-low-text)', margin: '4px 0' }}>Active</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>Redis Cache Synced</div>
          </div>
        </div>
      )}
    </div>
  );
};
