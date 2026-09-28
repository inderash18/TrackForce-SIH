import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { MetricCard } from '../components/common/MetricCard';
import { FolderGit2, CheckCircle2, AlertTriangle, Search, ChevronRight, Calendar, X } from 'lucide-react';
export const DashboardView = () => {
    const { scopedProjects, scopedAlerts, navigateToProject, user, switchDemoRole, reportingMonth, selectedMinistry, setSelectedMinistry } = useApp();
    const [projectSearch, setProjectSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    // Summary Metrics
    const totalProjects = scopedProjects.length;
    const onTrackProjects = useMemo(() => {
        return scopedProjects.filter((p) => (p.status === 'Ongoing' || p.status === 'On Track') &&
            p.riskLevel.toLowerCase() !== 'critical' &&
            p.riskLevel.toLowerCase() !== 'high' &&
            p.scheduleDelayProbability < 60);
    }, [scopedProjects]);
    const needsAttentionProjects = useMemo(() => {
        return scopedProjects.filter((p) => p.riskLevel.toLowerCase() === 'critical' ||
            p.riskLevel.toLowerCase() === 'high' ||
            p.status === 'Critical Delay' ||
            p.status === 'Delayed' ||
            p.scheduleDelayProbability >= 60 ||
            (p.progressGap && p.progressGap > 10));
    }, [scopedProjects]);
    // Exception list (actionable items with root cause)
    const exceptionsList = useMemo(() => {
        return needsAttentionProjects.map((p) => {
            let issueDesc = p.mainRiskReason || 'Milestone slippage and physical progress deviation';
            let targetDate = p.revisedCompletionDate || p.originalCompletionDate || 'Target: Dec 2026';
            let severity = p.riskLevel.toLowerCase() === 'critical' ? 'critical' : 'high';
            // Correlate with any active scoped alert
            const matchingAlert = scopedAlerts.find((a) => a.projectId === p.id);
            if (matchingAlert) {
                issueDesc = matchingAlert.reason || matchingAlert.warningTitle || issueDesc;
                if (matchingAlert.severity.toLowerCase() === 'critical')
                    severity = 'critical';
            }
            return {
                id: p.id,
                name: p.name,
                code: p.code,
                agency: p.implementingAgency,
                issue: issueDesc,
                severity,
                targetDate,
                physicalProgress: p.physicalProgress,
                scheduleStatus: p.status
            };
        });
    }, [needsAttentionProjects, scopedAlerts]);
    // Filtered Ministry Project List
    const filteredProjects = useMemo(() => {
        return scopedProjects.filter((p) => {
            if (statusFilter === 'on_track' && (p.status === 'Delayed' || p.status === 'Critical Delay' || p.riskLevel === 'critical'))
                return false;
            if (statusFilter === 'delayed' && p.status !== 'Delayed' && p.status !== 'Critical Delay')
                return false;
            if (statusFilter === 'needs_review' && p.riskLevel !== 'critical' && p.riskLevel !== 'high')
                return false;
            if (statusFilter === 'completed' && p.status !== 'Completed' && p.status !== 'Near Completion')
                return false;
            if (projectSearch &&
                !p.name.toLowerCase().includes(projectSearch.toLowerCase()) &&
                !p.code.toLowerCase().includes(projectSearch.toLowerCase()) &&
                !p.state.toLowerCase().includes(projectSearch.toLowerCase()) &&
                !p.implementingAgency.toLowerCase().includes(projectSearch.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [scopedProjects, statusFilter, projectSearch]);
    const ministryTitle = user.isNationalOversight
        ? selectedMinistry === 'All Ministries'
            ? 'National Infrastructure Portfolio'
            : selectedMinistry
        : user.ministry || 'My Ministry Projects';
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Header: Simple Ministry Title + Reporting Period */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{ministryTitle}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
              <Calendar size={11} className="text-sky-600"/>
              <span>{reportingMonth}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span>Authorised Officer: <strong>{user.name}</strong> ({user.department})</span>
            <span className="text-slate-300">•</span>
            <span>Last Synced: 28 Sep 2026, 14:00 IST</span>
          </p>
        </div>

        {/* National Scope Selector (Only visible for multi-ministry / national oversight users) */}
        {user.isNationalOversight ? (<div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Scope:</span>
            <select value={selectedMinistry} onChange={(e) => setSelectedMinistry(e.target.value)} className="gov-select text-xs py-1 px-2.5">
              <option value="All Ministries">All Ministries (National View)</option>
              <option value="Ministry of Railways">Ministry of Railways</option>
              <option value="Ministry of Road Transport and Highways">Ministry of Road Transport and Highways</option>
              <option value="Ministry of Power">Ministry of Power</option>
              <option value="Ministry of Petroleum and Natural Gas">Ministry of Petroleum & Natural Gas</option>
            </select>
          </div>) : (
        /* Role preview switch chips for demo convenience */
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] text-slate-400 px-1 font-medium">Switch Scope:</span>
            <button type="button" onClick={() => switchDemoRole('railways')} className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${user.ministry.includes('Railways') ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
              Railways
            </button>
            <button type="button" onClick={() => switchDemoRole('morth')} className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${user.ministry.includes('Road') ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
              MoRTH
            </button>
            <button type="button" onClick={() => switchDemoRole('national_admin')} className="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600 hover:bg-slate-200">
              National Oversight
            </button>
          </div>)}
      </div>

      {/* 3 Compact Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <MetricCard label="Total Projects" value={totalProjects} explanation={`Authorised ${user.isNationalOversight ? 'central sector' : user.ministry} registry`} trend={{ direction: 'neutral', text: '100% data coverage', isGood: true }} icon={<FolderGit2 size={16}/>} indicatorColor="primary"/>

        <MetricCard label="On Track" value={onTrackProjects.length} explanation="Delivering within planned milestone schedule" trend={{ direction: 'up', text: `${Math.round((onTrackProjects.length / (totalProjects || 1)) * 100)}% on schedule`, isGood: true }} icon={<CheckCircle2 size={16}/>} indicatorColor="medium"/>

        <MetricCard label="Needs Attention" value={needsAttentionProjects.length} explanation="Milestone slippage, delay risk, or cost variance" subtitleBadge="Immediate Review" trend={{ direction: 'down', text: 'Actionable exceptions', isGood: false }} icon={<AlertTriangle size={16}/>} indicatorColor="critical"/>
      </div>

      {/* Surface Exceptions Automatically: "Needs Attention" Section */}
      {exceptionsList.length > 0 ? (<div className="gov-card p-0 overflow-hidden border-amber-200/80">
          <div className="p-3 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-700"/>
              <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Actionable Exceptions ({exceptionsList.length} Projects Requiring Review)
              </h2>
            </div>
            <span className="text-[11px] text-amber-800">Surfaced based on milestone breaches & delay predictions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {exceptionsList.map((item) => (<div key={item.id} onClick={() => navigateToProject(item.id)} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 cursor-pointer transition">
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs hover:text-sky-600 transition">
                      {item.name}
                    </span>
                    <StatusBadge level={item.severity} size="sm"/>
                  </div>
                  <p className="text-xs text-slate-600 m-0 line-clamp-1">
                    <strong className="text-slate-700 font-medium">Issue:</strong> {item.issue}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Code: {item.code}</span>
                    <span>Agency: {item.agency}</span>
                    <span>Target: {item.targetDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-700">{item.physicalProgress}%</div>
                    <div className="text-[10px] text-slate-400">Physical Progress</div>
                  </div>
                  <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    navigateToProject(item.id);
                }} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                    <span>Review Project</span>
                    <ChevronRight size={13}/>
                  </button>
                </div>
              </div>))}
          </div>
        </div>) : (<div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600"/>
          <span>No urgent project exceptions found. All monitored projects are progressing within milestone parameters.</span>
        </div>)}

      {/* Ministry Project List Workspace */}
      <div className="gov-card p-0 overflow-hidden">
        {/* Table Toolbar: Search & Simple Status Filter */}
        <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FolderGit2 size={15} className="text-sky-600 shrink-0"/>
            <span className="font-bold text-xs text-slate-800">
              {ministryTitle} Directory ({filteredProjects.length})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Search projects..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="gov-input pl-8 py-1 text-xs w-full sm:w-56"/>
              {projectSearch && (<button type="button" onClick={() => setProjectSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={12}/>
                </button>)}
            </div>

            {/* Status Filter */}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="gov-select text-xs py-1 px-2.5 shrink-0">
              <option value="all">All Statuses</option>
              <option value="on_track">On Track</option>
              <option value="delayed">Delayed</option>
              <option value="needs_review">Needs Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Clean Ministry Project Table */}
        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Progress</th>
                <th>Schedule Status</th>
                <th>Next Milestone / Completion</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (<tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No projects found matching the filter criteria.
                  </td>
                </tr>) : (filteredProjects.map((p) => (<tr key={p.id} onClick={() => navigateToProject(p.id)} className="hover:bg-slate-50/80 cursor-pointer transition">
                    <td>
                      <div className="font-semibold text-slate-900 text-xs hover:text-sky-600 transition">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.code} · {p.implementingAgency} · {p.state}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                          <div style={{ width: `${p.physicalProgress}%` }} className="h-full bg-sky-600 rounded-full"/>
                        </div>
                        <span className="tabular-nums text-xs font-semibold text-slate-700">
                          {p.physicalProgress}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge level={p.riskLevel} customLabel={p.status} size="sm"/>
                    </td>
                    <td>
                      <div className="text-xs text-slate-700 font-medium">
                        {p.revisedCompletionDate || p.originalCompletionDate || 'Target Dec 2026'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.expectedDelayMonths > 0 ? `+${p.expectedDelayMonths} mos slippage` : 'On schedule'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" onClick={(e) => {
                e.stopPropagation();
                navigateToProject(p.id);
            }} className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition">
                        <span>View</span>
                        <ChevronRight size={13}/>
                      </button>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
