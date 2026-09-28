import React, { useState, useMemo, useEffect } from 'react';
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
  const { scopedAlerts, updateAlertStatus, navigateToProject, user, showNotification, reportingMonth } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'needs_review' | 'actions'>('needs_review');
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [actionsFilter, setActionsFilter] = useState<'all' | 'assigned_to_me'>('all');

  const [selectedReviewAlert, setSelectedReviewAlert] = useState<EarlyWarningAlert | null>(null);
  const [showShapDetails, setShowShapDetails] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [assignedOwner, setAssignedOwner] = useState('');

  // Lock background scroll when modal is open & listen for Escape key
  useEffect(() => {
    if (!selectedReviewAlert) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReviewAlert(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedReviewAlert]);

  // 1. "Needs Review" List (unresolved alerts)
  const needsReviewList = useMemo(() => {
    return scopedAlerts.filter((a) => {
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
  }, [scopedAlerts, severityFilter, search]);

  // 2. "Actions" List (assigned interventions & reviewed items)
  const actionsList = useMemo(() => {
    return scopedAlerts
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
  }, [scopedAlerts, actionsFilter, search, user]);

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

  const criticalCount = scopedAlerts.filter(
    (a: EarlyWarningAlert) => a.severity.toLowerCase() === 'critical' && (a.status || '').toLowerCase() !== 'resolved'
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

      {/* FOCUSED DETAIL REVIEW DIALOG (ACCESSIBLE, SOLID OPAQUE CONTAINER) */}
      {selectedReviewAlert && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setSelectedReviewAlert(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-dialog-title"
        >
          <div
            className="w-full max-w-[720px] max-h-[calc(100dvh-32px)] bg-white rounded-2xl border border-slate-200 shadow-2xl z-[260] flex flex-col overflow-hidden relative text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-white shrink-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <StatusBadge level={selectedReviewAlert.severity} size="sm" />
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                    {selectedReviewAlert.projectId}
                  </span>
                </div>
                <h2
                  id="review-dialog-title"
                  className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug m-0"
                >
                  {selectedReviewAlert.projectName}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close review dialog"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0 cursor-pointer"
                onClick={() => setSelectedReviewAlert(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 text-sm text-slate-700 bg-white">
              {/* 1. Issue: What Happened */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">What happened</h4>
                <p className="text-slate-800 text-sm leading-relaxed m-0 font-normal">
                  {selectedReviewAlert.reason ||
                    selectedReviewAlert.aiExplanation ||
                    'Physical milestone progress velocity slowed significantly below schedule expectations.'}
                </p>
              </div>

              {/* 2. Evidence: Aligned Label/Value Pairs */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Supporting Evidence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
                  <div className="flex justify-between sm:justify-start sm:gap-4 py-1 border-b border-slate-100/80">
                    <span className="text-slate-500 min-w-[120px]">Reporting period:</span>
                    <strong className="text-slate-800">{reportingMonth || 'September 2026'}</strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 py-1 border-b border-slate-100/80">
                    <span className="text-slate-500 min-w-[120px]">Last updated:</span>
                    <span className="text-slate-700 font-medium">{selectedReviewAlert.timestamp || '2 hours ago'}</span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 py-1 border-b border-slate-100/80">
                    <span className="text-slate-500 min-w-[120px]">Responsible agency:</span>
                    <strong className="text-slate-800 truncate max-w-[200px]" title={selectedReviewAlert.responsibleAgency}>
                      {selectedReviewAlert.responsibleAgency || 'Nodal Implementing Agency'}
                    </strong>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-4 py-1 border-b border-slate-100/80">
                    <span className="text-slate-500 min-w-[120px]">Status:</span>
                    <span className="font-semibold text-amber-700">
                      {selectedReviewAlert.status || 'Active Surveillance'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Next Step: Lightly Tinted Sky Panel */}
              <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200/90 text-sky-950">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider block mb-1">
                  Suggested next step
                </span>
                <p className="text-sky-900 text-sm leading-relaxed m-0 font-normal">
                  {selectedReviewAlert.recommendedAction ||
                    'Convene inter-ministerial review desk with state authorities to resolve Right-of-Way and forest clearance hurdles.'}
                </p>
              </div>

              {/* 4. Collapsible Technical Details (SHAP) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowShapDetails(!showShapDetails)}
                  aria-expanded={showShapDetails}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition font-semibold text-xs text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-sky-600" />
                    <span>Technical details & ML attribution (SHAP)</span>
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transform transition-transform text-slate-500 ${showShapDetails ? 'rotate-180' : ''}`}
                  />
                </button>

                {showShapDetails && (
                  <div className="p-4 bg-white space-y-2.5 text-xs border-t border-slate-200">
                    <p className="text-slate-500 m-0">
                      TreeSHAP feature contribution breakdown based on predictive delay models:
                    </p>
                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-700">Land Acquisition & RoW Delay</span>
                        <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                          +34% Risk SHAP
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-700">Contractor Mobilization Index</span>
                        <span className="font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-[11px]">
                          +22% Risk SHAP
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-700">Expenditure / Physical Progress Gap</span>
                        <span className="font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                          +15% Risk SHAP
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Action Form */}
              <div className="pt-2 border-t border-slate-100 space-y-3.5">
                <div className="space-y-1">
                  <label htmlFor="assign-owner-input" className="block text-xs font-semibold text-slate-800">
                    Assign to
                  </label>
                  <input
                    id="assign-owner-input"
                    type="text"
                    placeholder="e.g. NHAI Technical Desk / Project Director"
                    value={assignedOwner}
                    onChange={(e) => setAssignedOwner(e.target.value)}
                    className="gov-input w-full h-11 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-lg px-3.5"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="review-note-input" className="block text-xs font-semibold text-slate-800">
                    Review note
                  </label>
                  <textarea
                    id="review-note-input"
                    rows={3}
                    placeholder="Provide intervention directive, milestone adjustment note, or meeting outcome..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="gov-input w-full text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-lg p-3 leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pinned Footer */}
            <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigateToProject(selectedReviewAlert.projectId);
                  setSelectedReviewAlert(null);
                }}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1.5 p-1 self-start sm:self-auto"
              >
                <ExternalLink size={13} />
                <span>View full project dossier</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => handleAcknowledge(selectedReviewAlert.id)}
                  className="btn-secondary text-xs h-9 px-4 font-semibold"
                >
                  Acknowledge
                </button>
                <button
                  type="button"
                  onClick={() => handleAssignAction(selectedReviewAlert.id)}
                  className="btn-primary text-xs h-9 px-4.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                >
                  Assign Action
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkResolved(selectedReviewAlert.id)}
                  className="btn-secondary text-xs h-9 px-4 text-emerald-700 hover:bg-emerald-50 border-emerald-300 font-semibold"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
