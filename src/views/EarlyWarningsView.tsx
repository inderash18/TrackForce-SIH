import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  X,
  Clock,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { EarlyWarningAlert } from '../types/project';

export const EarlyWarningsView: React.FC = () => {
  const { alerts, updateAlertStatus, navigateToProject, user, showNotification } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'needs_review' | 'actions'>('needs_review');
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [actionsFilter, setActionsFilter] = useState<'all' | 'assigned_to_me'>('all');

  const [selectedReviewAlert, setSelectedReviewAlert] = useState<EarlyWarningAlert | null>(null);
  const [showShapDetails, setShowShapDetails] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [assignedOwner, setAssignedOwner] = useState('');

  // 1. "Needs Review" List (unresolved alerts)
  const needsReviewList = useMemo(() => {
    return alerts.filter((a) => {
      const isResolved = (a.status || '').toLowerCase() === 'resolved';
      if (isResolved) return false;
      if (severityFilter !== 'all' && a.severity.toLowerCase() !== severityFilter) return false;
      if (
        search &&
        !a.projectName.toLowerCase().includes(search.toLowerCase()) &&
        !a.projectId.toLowerCase().includes(search.toLowerCase()) &&
        !(a.reason || '').toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [alerts, severityFilter, search]);

  // 2. "Actions" List (assigned interventions & reviewed items)
  const actionsList = useMemo(() => {
    return alerts
      .filter((a) => {
        const isAssignedOrActioned =
          (a.status || '').toLowerCase() === 'reviewed' ||
          (a.status || '').toLowerCase() === 'escalated' ||
          (a.status || '').toLowerCase() === 'active' ||
          Boolean(a.responsibleAgency || a.assignedOfficer);

        if (!isAssignedOrActioned) return false;

        if (actionsFilter === 'assigned_to_me' && user.isLoggedIn) {
          const owner = (a.assignedOfficer || a.responsibleAgency || '').toLowerCase();
          const userName = (user.name || '').toLowerCase();
          if (!owner.includes(userName) && !owner.includes('taskforce')) return false;
        }

        if (
          search &&
          !a.projectName.toLowerCase().includes(search.toLowerCase()) &&
          !a.projectId.toLowerCase().includes(search.toLowerCase()) &&
          !(a.recommendedAction || a.reason || '').toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .map((a) => ({
        id: a.id,
        projectId: a.projectId,
        projectName: a.projectName,
        actionTitle: a.recommendedAction || 'Escalate to Inter-Ministerial Taskforce for clearance resolution',
        owner: a.assignedOfficer || a.responsibleAgency || 'IPMD Desk Officer',
        dueDate: '30 Oct 2026',
        status: a.status || 'In Progress',
        severity: a.severity,
        rawAlert: a
      }));
  }, [alerts, actionsFilter, search, user]);

  const handleAcknowledge = (alertId: string) => {
    updateAlertStatus(alertId, 'reviewed' as any, 'Acknowledged by monitoring analyst');
    showNotification('Risk alert acknowledged and marked under active surveillance.');
    if (selectedReviewAlert?.id === alertId) {
      setSelectedReviewAlert(null);
    }
  };

  const handleAssignAction = (alertId: string) => {
    const owner = assignedOwner || 'MoSPI Joint Taskforce';
    const note = actionNote ? `Assigned to ${owner}: ${actionNote}` : `Assigned to ${owner}`;
    updateAlertStatus(alertId, 'escalated' as any, note);
    showNotification(`Intervention action successfully assigned to ${owner}.`);
    setSelectedReviewAlert(null);
    setActionNote('');
    setAssignedOwner('');
  };

  const handleMarkResolved = (alertId: string) => {
    updateAlertStatus(alertId, 'resolved' as any, actionNote || 'Resolved following nodal ministry review');
    showNotification('Risk item marked as resolved.');
    setSelectedReviewAlert(null);
  };

  const criticalCount = alerts.filter(
    (a) => a.severity.toLowerCase() === 'critical' && (a.status || '').toLowerCase() !== 'resolved'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header: Title + Primary Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Risks & Actions</h1>
            {criticalCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                <AlertTriangle size={12} /> {criticalCount} Critical
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritised risk review, early warning signals, and assigned intervention workflow
          </p>
        </div>

        {/* 2 Primary Tabs: "Needs review" and "Actions" */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100/80 text-xs">
          <button
            type="button"
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeMainTab === 'needs_review'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => {
              setActiveMainTab('needs_review');
              setSelectedReviewAlert(null);
            }}
          >
            Needs Review ({needsReviewList.length})
          </button>
          <button
            type="button"
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeMainTab === 'actions'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => {
              setActiveMainTab('actions');
              setSelectedReviewAlert(null);
            }}
          >
            Actions ({actionsList.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-card p-3 flex flex-col md:flex-row md:items-center gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeMainTab === 'needs_review'
                ? 'Search risks by project name, code, or issue...'
                : 'Search actions by project or intervention task...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gov-input pl-9 text-xs w-full py-1.5"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {activeMainTab === 'needs_review' ? (
          <div className="w-full md:w-44 shrink-0">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="gov-select text-xs w-full py-1.5"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Severity</option>
              <option value="high">High Severity</option>
              <option value="medium">Moderate / Medium</option>
            </select>
          </div>
        ) : (
          <div className="w-full md:w-48 shrink-0">
            <select
              value={actionsFilter}
              onChange={(e) => setActionsFilter(e.target.value as any)}
              className="gov-select text-xs w-full py-1.5"
            >
              <option value="all">All Authorised Actions</option>
              <option value="assigned_to_me">Assigned to Me / Taskforce</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeMainTab === 'needs_review' ? (
        /* TAB 1: NEEDS REVIEW TABLE */
        <div className="gov-card p-0 overflow-hidden">
          <div className="gov-table-wrapper" style={{ border: 'none' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Issue Summary</th>
                  <th>Severity</th>
                  <th>Updated</th>
                  <th style={{ textAlign: 'right' }}>Review</th>
                </tr>
              </thead>
              <tbody>
                {needsReviewList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <p className="text-sm">No unresolved risks under this filter.</p>
                    </td>
                  </tr>
                ) : (
                  needsReviewList.map((alert) => (
                    <tr
                      key={alert.id}
                      onClick={() => {
                        setSelectedReviewAlert(alert);
                        setShowShapDetails(false);
                      }}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td>
                        <div className="font-semibold text-slate-900 text-xs hover:text-sky-600 transition-colors">
                          {alert.projectName}
                        </div>
                        <div className="text-[11px] text-slate-400">{alert.projectId}</div>
                      </td>
                      <td>
                        <p className="text-xs text-slate-700 line-clamp-1 max-w-md m-0">
                          {alert.reason || alert.warningTitle || 'Schedule divergence and milestone slippage detected'}
                        </p>
                      </td>
                      <td>
                        <StatusBadge level={alert.severity} size="sm" />
                      </td>
                      <td>
                        <span className="text-xs text-slate-500 tabular-nums">
                          {alert.timestamp || 'Recent Cycle'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReviewAlert(alert);
                            setShowShapDetails(false);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition"
                        >
                          Review <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 2: ACTIONS TABLE */
        <div className="gov-card p-0 overflow-hidden">
          <div className="gov-table-wrapper" style={{ border: 'none' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Action / Intervention</th>
                  <th>Project</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {actionsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <p className="text-sm">No assigned actions found.</p>
                    </td>
                  </tr>
                ) : (
                  actionsList.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedReviewAlert(item.rawAlert);
                        setShowShapDetails(false);
                      }}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td>
                        <div className="font-semibold text-slate-900 text-xs">{item.actionTitle}</div>
                      </td>
                      <td>
                        <div className="text-xs text-slate-700 font-medium">{item.projectName}</div>
                        <div className="text-[11px] text-slate-400">{item.projectId}</div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-600 inline-flex items-center gap-1">
                          <UserCheck size={12} className="text-sky-600" />
                          {item.owner}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs text-slate-500 tabular-nums inline-flex items-center gap-1">
                          <Clock size={11} /> {item.dueDate}
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          {item.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReviewAlert(item.rawAlert);
                            setShowShapDetails(false);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition"
                        >
                          View <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FOCUSED DETAIL REVIEW DRAWER */}
      {selectedReviewAlert && (
        <div className="paimana-modal-backdrop" onClick={() => setSelectedReviewAlert(null)}>
          <div
            className="paimana-modal-card max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="paimana-modal-header border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge level={selectedReviewAlert.severity} size="sm" />
                  <span className="text-xs text-slate-400">{selectedReviewAlert.projectId}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedReviewAlert.projectName}</h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700"
                onClick={() => setSelectedReviewAlert(null)}
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-4 space-y-3.5 text-xs text-slate-700">
              {/* 1. What Happened */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="font-semibold text-slate-900 block mb-1">What Happened</span>
                <p className="text-slate-600 m-0 leading-relaxed">
                  {selectedReviewAlert.reason ||
                    selectedReviewAlert.aiExplanation ||
                    'Physical milestone progress velocity slowed significantly below schedule expectations.'}
                </p>
              </div>

              {/* 2. Supporting Evidence */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="font-semibold text-slate-900 block mb-1">Supporting Evidence</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Observed reporting period: {selectedReviewAlert.timestamp || 'Recent Monthly Cycle'}</li>
                  <li>Responsible Agency: {selectedReviewAlert.responsibleAgency || 'Nodal Implementing Agency'}</li>
                  <li>Status: {selectedReviewAlert.status || 'Active Surveillance'}</li>
                </ul>
              </div>

              {/* 3. Suggested Next Step */}
              <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200">
                <span className="font-semibold text-sky-900 block mb-1">Suggested Next Step</span>
                <p className="text-sky-800 m-0 leading-relaxed">
                  {selectedReviewAlert.recommendedAction ||
                    'Convene inter-ministerial review desk with state authorities to resolve Right-of-Way and forest clearance hurdles.'}
                </p>
              </div>

              {/* 4. Expandable Technical Assessment & SHAP Drivers */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowShapDetails(!showShapDetails)}
                  className="w-full p-2.5 bg-slate-50 text-left font-medium text-slate-700 flex items-center justify-between hover:bg-slate-100 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-sky-600" />
                    <span>Technical Assessment & ML Feature Attribution (SHAP)</span>
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform ${showShapDetails ? 'rotate-180' : ''}`}
                  />
                </button>

                {showShapDetails && (
                  <div className="p-3 bg-white space-y-2 text-[11.5px] border-t border-slate-100">
                    <p className="text-slate-500 m-0">
                      Model feature contribution breakdown based on XGBoost / LightGBM inference:
                    </p>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center p-1.5 rounded bg-slate-50">
                        <span>Land Acquisition & RoW Delay</span>
                        <span className="font-bold text-red-600">+34% Risk SHAP</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 rounded bg-slate-50">
                        <span>Contractor Mobilization Index</span>
                        <span className="font-bold text-orange-600">+22% Risk SHAP</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 rounded bg-slate-50">
                        <span>Expenditure / Physical Progress Gap</span>
                        <span className="font-bold text-amber-600">+15% Risk SHAP</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Assignment Inputs */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-900 block">Take Action</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Assign to Officer / Agency (e.g. NHAI Desk)"
                    value={assignedOwner}
                    onChange={(e) => setAssignedOwner(e.target.value)}
                    className="gov-input w-full py-1 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Action or review note..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="gov-input w-full py-1 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigateToProject(selectedReviewAlert.projectId);
                    setSelectedReviewAlert(null);
                  }}
                  className="btn-ghost text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 p-0"
                >
                  <ExternalLink size={12} /> Open Full Project Dossier
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(selectedReviewAlert.id)}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    Acknowledge
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignAction(selectedReviewAlert.id)}
                    className="btn-primary text-xs px-3.5 py-1.5"
                  >
                    Assign Action
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkResolved(selectedReviewAlert.id)}
                    className="btn-secondary text-xs px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 border-emerald-300"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
