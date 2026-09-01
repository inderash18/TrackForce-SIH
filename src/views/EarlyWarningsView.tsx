import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export const EarlyWarningsView: React.FC = () => {
  const { alerts, updateAlertStatus, navigateToProject } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high' | 'medium' | 'resolved'>('all');
  const [assignModalAlertId, setAssignModalAlertId] = useState<string | null>(null);
  const [officerNote, setOfficerNote] = useState('');

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'resolved') return a.status === 'resolved';
    return a.severity === activeTab && a.status !== 'resolved';
  });

  const handleAssignSubmit = (alertId: string) => {
    updateAlertStatus(alertId, 'reviewed', officerNote || 'Assigned to MoSPI Joint Secretary Taskforce');
    setAssignModalAlertId(null);
    setOfficerNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Early Warning Signal Center</h1>
          <p className="page-hero-subtitle">
            AI-detected velocity bottlenecks, spending-to-progress divergence anomalies, and contractual distress alerts
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="gov-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('all')}
          >
            All Signals ({alerts.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('critical')}
          >
            Critical ({alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'high' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('high')}
          >
            High ({alerts.filter(a => a.severity === 'high' && a.status !== 'resolved').length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('medium')}
          >
            Medium ({alerts.filter(a => a.severity === 'medium' && a.status !== 'resolved').length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'resolved' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({alerts.filter(a => a.status === 'resolved').length})
          </button>
        </div>

        <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
          Active Surveillance Stream (15-min ingestion cycle)
        </span>
      </div>

      {/* Alerts Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAlerts.length === 0 ? (
          <div className="gov-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No alerts found under this category.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="gov-card"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${
                  alert.severity === 'critical'
                    ? 'var(--status-critical-dot)'
                    : alert.severity === 'high'
                    ? 'var(--status-high-dot)'
                    : alert.severity === 'medium'
                    ? 'var(--status-medium-dot)'
                    : 'var(--status-low-dot)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <StatusBadge level={alert.severity} />
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                      {alert.id}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      • {alert.timestamp}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)', margin: '0 0 4px' }}>
                    {alert.warningTitle}
                  </h3>

                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
                    <strong>Project:</strong> {alert.projectName} ({alert.sector} • {alert.state})
                  </div>
                </div>

                {/* Risk Change Value Pill */}
                <div style={{ padding: '8px 14px', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)', textAlign: 'right' }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', display: 'block' }}>Risk Trajectory</span>
                  <strong style={{ fontSize: '13px', color: alert.severity === 'critical' ? 'var(--status-critical-text)' : 'var(--color-text-dark)' }}>
                    {alert.riskChangeText}
                  </strong>
                </div>
              </div>

              {/* AI Explanation Box */}
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                <strong style={{ fontSize: '12px', color: 'var(--color-text-dark)', display: 'block', marginBottom: '4px' }}>
                  AI Root Cause Diagnostics:
                </strong>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>
                  {alert.aiExplanation}
                </p>
              </div>

              {/* Recommended Action & Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 600, display: 'block' }}>
                    Recommended Mitigation Action:
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--color-text-dark)', fontWeight: 500 }}>
                    {alert.recommendedAction}
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Implementing Agency: <strong>{alert.responsibleAgency}</strong> {alert.assignedOfficer ? `• Assigned: ${alert.assignedOfficer}` : ''}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {alert.status !== 'resolved' && (
                    <>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateAlertStatus(alert.id, 'reviewed', 'Acknowledged by MoSPI')}
                      >
                        <UserCheck size={13} /> Mark Reviewed
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setAssignModalAlertId(alert.id)}
                      >
                        Assign Officer
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--status-low-text)' }}
                        onClick={() => updateAlertStatus(alert.id, 'resolved', 'Mitigation verified')}
                      >
                        <CheckCircle2 size={13} /> Resolve
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigateToProject(alert.projectId)}
                  >
                    Open Project Intelligence →
                  </button>
                </div>
              </div>

              {/* Inline Assign Modal */}
              {assignModalAlertId === alert.id && (
                <div style={{ marginTop: '14px', padding: '12px', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="gov-input"
                    placeholder="Enter assigned officer name / taskforce directive..."
                    value={officerNote}
                    onChange={e => setOfficerNote(e.target.value)}
                    style={{ flex: 1, fontSize: '12px' }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={() => handleAssignSubmit(alert.id)}>
                    Confirm Directive
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setAssignModalAlertId(null)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
