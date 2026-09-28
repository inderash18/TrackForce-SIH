import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  CheckCircle2,
  UserCheck,
  ChevronRight,
  X
} from 'lucide-react';

export const EarlyWarningsView: React.FC = () => {
  const { alerts, updateAlertStatus, navigateToProject } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high' | 'medium' | 'resolved'>('all');
  const [assignModalAlertId, setAssignModalAlertId] = useState<string | null>(null);
  const [officerNote, setOfficerNote] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'resolved') return a.status.toLowerCase() === 'resolved';
    return a.severity.toLowerCase() === activeTab.toLowerCase() && a.status.toLowerCase() !== 'resolved';
  });

  const handleAssignSubmit = (alertId: string) => {
    updateAlertStatus(alertId, 'reviewed' as any, officerNote || 'Assigned to MoSPI Joint Secretary Taskforce');
    setAssignModalAlertId(null);
    setOfficerNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-title">
            Early Warning Intelligence Signals
          </h1>
          <p className="page-subtitle">
            Algorithmic anomaly detection flagging schedule divergences, right-of-way litigation, and velocity stalls
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div
        className="gov-card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            className={activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveTab('all')}
          >
            All Signals ({alerts.length})
          </button>
          <button
            className={activeTab === 'critical' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveTab('critical')}
          >
            Critical ({alerts.filter((a) => a.severity.toLowerCase() === 'critical' && a.status.toLowerCase() !== 'resolved').length})
          </button>
          <button
            className={activeTab === 'high' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveTab('high')}
          >
            High ({alerts.filter((a) => a.severity.toLowerCase() === 'high' && a.status.toLowerCase() !== 'resolved').length})
          </button>
          <button
            className={activeTab === 'medium' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveTab('medium')}
          >
            Moderate ({alerts.filter((a) => (a.severity.toLowerCase() === 'medium' || a.severity.toLowerCase() === 'moderate') && a.status.toLowerCase() !== 'resolved').length})
          </button>
          <button
            className={activeTab === 'resolved' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '12px', padding: '5px 12px' }}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({alerts.filter((a) => a.status.toLowerCase() === 'resolved').length})
          </button>
        </div>

        <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
          Real-time algorithmic surveillance feed
        </span>
      </div>

      {/* Alerts Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="gov-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No active early warning signals under this filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="gov-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderLeft: `4px solid ${
                  alert.severity.toLowerCase() === 'critical'
                    ? 'var(--status-critical)'
                    : alert.severity.toLowerCase() === 'high'
                    ? 'var(--status-high)'
                    : 'var(--status-medium)'
                }`
              }}
            >
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <StatusBadge level={alert.severity} size="sm" />
                  <span style={{ fontSize: '11px', color: 'var(--color-accent-cyan)', fontWeight: 600 }}>
                    {alert.warningType || 'Velocity Drop'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-dim)' }}>·</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {alert.timestamp || 'Fresh Signal'}
                  </span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                  {alert.projectName}
                </div>

                <p style={{ margin: '0 0 8px', fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {alert.reason}
                </p>

                {alert.assignedOfficer && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <UserCheck size={12} color="var(--status-low)" />
                    Assigned: <strong style={{ color: 'var(--color-text-secondary)' }}>{alert.assignedOfficer}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {alert.status.toLowerCase() !== 'resolved' && (
                  <>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '11.5px', padding: '5px 10px' }}
                      onClick={() => setAssignModalAlertId(alert.id)}
                    >
                      <UserCheck size={13} />
                      <span>Assign</span>
                    </button>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '11.5px', padding: '5px 10px' }}
                      onClick={() => updateAlertStatus(alert.id, 'resolved')}
                    >
                      <CheckCircle2 size={13} />
                      <span>Resolve</span>
                    </button>
                  </>
                )}
                <button
                  className="btn-ghost"
                  style={{ fontSize: '11.5px', padding: '5px 8px', color: 'var(--color-action-primary)' }}
                  onClick={() => navigateToProject(alert.projectId)}
                >
                  Dossier <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assignment Modal */}
      {assignModalAlertId && (
        <div
          className="drawer-backdrop"
          onClick={() => setAssignModalAlertId(null)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '420px',
              maxWidth: '90vw',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              boxShadow: 'var(--shadow-elevated)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Assign Early Warning Action
              </h3>
              <button onClick={() => setAssignModalAlertId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                Taskforce Officer / Action Directive:
              </label>
              <textarea
                className="gov-input"
                style={{ width: '100%', height: '80px', resize: 'none' }}
                placeholder="e.g. Assigned to Director (Land Revenue) for immediate survey inspection..."
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-secondary" onClick={() => setAssignModalAlertId(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => handleAssignSubmit(assignModalAlertId)}>
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
