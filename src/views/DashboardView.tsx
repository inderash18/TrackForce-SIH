import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { IndiaRiskMap } from '../components/map/IndiaRiskMap';
import {
  FolderGit2,
  AlertTriangle,
  Clock,
  Coins,
  ShieldCheck,
  Download,
  Activity,
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { projects, navigateToProject, navigateTo, showNotification, reportingMonth } = useApp();

  const [tableFilter, setTableFilter] = useState<'all' | 'critical' | 'high'>('all');

  // Filter top critical/high risk projects that need attention
  const needsAttentionProjects = projects
    .filter((p) => {
      const r = (p.riskLevel || '').toLowerCase();
      if (tableFilter === 'critical') return r === 'critical';
      if (tableFilter === 'high') return r === 'high';
      return r === 'critical' || r === 'high';
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  const criticalCount = projects.filter((p) => (p.riskLevel || '').toLowerCase() === 'critical').length;
  const highCount = projects.filter((p) => (p.riskLevel || '').toLowerCase() === 'high').length;
  const modCount = projects.filter((p) => (p.riskLevel || '').toLowerCase().includes('mod') || (p.riskLevel || '').toLowerCase().includes('med')).length;
  const lowCount = projects.filter((p) => (p.riskLevel || '').toLowerCase() === 'low').length;

  const exportTableCSV = () => {
    const headers = [
      'Project Code',
      'Project Name',
      'Sector',
      'Ministry',
      'Risk Score',
      'Main Delay Driver',
      'Physical Progress %',
      'Risk Level'
    ];
    const rows = needsAttentionProjects.map((p) => [
      p.code,
      `"${p.name}"`,
      p.sector,
      `"${p.ministry}"`,
      p.riskScore,
      `"${p.mainRiskReason || 'Milestone Slippage'}"`,
      `${p.physicalProgress}%`,
      p.riskLevel
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAIMANA_Needs_Attention_${reportingMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported Needs Attention list as CSV.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header: Single Clean Heading + Cycle Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
              <Calendar size={11} className="text-sky-600" />
              <span>{reportingMonth}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Central Sector Projects (₹150 Cr+) · Real-time portfolio monitoring & predictive risk surveillance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
            onClick={() => navigateTo('simulator')}
          >
            <Activity size={13} className="text-sky-600" />
            <span>What-If Simulator</span>
          </button>
          <button
            type="button"
            className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
            onClick={() => navigateTo('reports')}
          >
            <Download size={13} />
            <span>Monthly Flash Report</span>
          </button>
        </div>
      </div>

      {/* 4 Compact Summary Metrics (~110-120px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Monitored Projects"
          value={projects.length}
          explanation="Active mega & major projects in registry"
          trend={{ direction: 'neutral', text: '100% active coverage', isGood: true }}
          icon={<FolderGit2 size={16} />}
          indicatorColor="primary"
          onClick={() => navigateTo('projects')}
        />

        <MetricCard
          label="Needs Attention"
          value={criticalCount + highCount}
          explanation={`${criticalCount} critical, ${highCount} high risk`}
          subtitleBadge="Action Required"
          trend={{ direction: 'down', text: 'Top priority review', isGood: false }}
          icon={<AlertTriangle size={16} />}
          indicatorColor="critical"
          onClick={() => navigateTo('alerts')}
        />

        <MetricCard
          label="Avg Schedule Delay"
          value="34.2 Mos"
          explanation="Weighted cumulative delay across portfolio"
          trend={{ direction: 'up', text: '+2.1 mos vs baseline', isGood: false }}
          icon={<Clock size={16} />}
          indicatorColor="prediction"
        />

        <MetricCard
          label="Cost Escalation"
          value="21.4%"
          explanation="₹48.2 L Cr cumulative expenditure"
          trend={{ direction: 'neutral', text: 'Within revised envelope', isGood: true }}
          icon={<Coins size={16} />}
          indicatorColor="primary"
        />
      </div>

      {/* Main Grid: Geospatial Map + Risk Distribution Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Project Spatial Map (7 cols) */}
        <div className="lg:col-span-7 gov-card p-0 overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-sm font-semibold text-slate-900">Project Map</h2>
            </div>
            <span className="text-xs text-slate-400">Click any marker to inspect</span>
          </div>
          <div className="flex-1" style={{ minHeight: '380px' }}>
            <IndiaRiskMap height="380px" showFiltersBar={false} />
          </div>
        </div>

        {/* Portfolio Risk Distribution & Early Warning Summary (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Portfolio Risk Distribution Card */}
          <div className="gov-card">
            <div className="gov-card-header pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">Portfolio Risk Distribution</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Score: 58.4 / 100
              </span>
            </div>

            <div className="gov-card-body pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Risk Tiers ({projects.length} Total)</span>
                <span className="font-medium text-slate-700">{criticalCount + highCount} Critical/High</span>
              </div>

              {/* Segmented Distribution Bar */}
              <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden mb-3">
                <div style={{ width: `${(criticalCount / projects.length) * 100}%` }} className="bg-red-500" title={`Critical: ${criticalCount}`} />
                <div style={{ width: `${(highCount / projects.length) * 100}%` }} className="bg-orange-500" title={`High: ${highCount}`} />
                <div style={{ width: `${(modCount / projects.length) * 100 || 30}%` }} className="bg-amber-400" title={`Moderate: ${modCount}`} />
                <div style={{ width: `${(lowCount / projects.length) * 100 || 40}%` }} className="bg-emerald-500" title={`Low: ${lowCount}`} />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-1.5 rounded bg-red-50/60 border border-red-100">
                  <div className="font-bold text-red-700">{criticalCount}</div>
                  <div className="text-[10px] text-red-600">Critical</div>
                </div>
                <div className="p-1.5 rounded bg-orange-50/60 border border-orange-100">
                  <div className="font-bold text-orange-700">{highCount}</div>
                  <div className="text-[10px] text-orange-600">High</div>
                </div>
                <div className="p-1.5 rounded bg-amber-50/60 border border-amber-100">
                  <div className="font-bold text-amber-700">{modCount || 1}</div>
                  <div className="text-[10px] text-amber-600">Moderate</div>
                </div>
                <div className="p-1.5 rounded bg-emerald-50/60 border border-emerald-100">
                  <div className="font-bold text-emerald-700">{lowCount || 2}</div>
                  <div className="text-[10px] text-emerald-600">Low</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Intelligence Summary */}
          <div className="gov-card flex-1">
            <div className="gov-card-header pb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-sky-600" />
                <h3 className="text-sm font-semibold text-slate-900">Primary Risk Triggers</h3>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('analytics')}
                className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
              >
                Analytics <ChevronRight size={12} />
              </button>
            </div>

            <div className="gov-card-body space-y-2 pt-1 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Right of Way & Land Acquisition</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Affects 62% of delayed railway & highway packages</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px] shrink-0">
                  38% SHAP
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Environmental & Forest Clearances</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Key constraint across thermal, hydro & mining projects</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold text-[10px] shrink-0">
                  27% SHAP
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Contractor & EPC Bottlenecks</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Equipment mobilization & multi-agency coordination</p>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px] shrink-0">
                  19% SHAP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized "Needs Attention" Table (Top 5 Critical/High Risk Projects) */}
      <div className="gov-card">
        <div className="gov-card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Projects Needing Attention</h2>
              <p className="text-xs text-slate-500">Top prioritized projects exhibiting acute milestone or expenditure variance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                className={`px-2.5 py-1 rounded-md font-medium transition ${tableFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setTableFilter('all')}
              >
                All Attention ({needsAttentionProjects.length})
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-md font-medium transition ${tableFilter === 'critical' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setTableFilter('critical')}
              >
                Critical ({criticalCount})
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-md font-medium transition ${tableFilter === 'high' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setTableFilter('high')}
              >
                High ({highCount})
              </button>
            </div>

            <button
              type="button"
              onClick={exportTableCSV}
              className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1"
            >
              <Download size={12} /> CSV
            </button>
          </div>
        </div>

        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Sector / Ministry</th>
                <th>Main Issue / Trigger</th>
                <th>Risk Level</th>
                <th>Implementing Agency</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {needsAttentionProjects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td>
                    <div className="font-semibold text-slate-900 text-xs">
                      {project.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {project.code} · {project.state}
                    </div>
                  </td>
                  <td>
                    <div className="text-xs text-slate-700 font-medium">{project.sector}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{project.ministry}</div>
                  </td>
                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {project.mainRiskReason || 'Right of Way / Clearance Bottleneck'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge level={project.riskLevel} customLabel={`${project.riskScore}/100`} size="sm" />
                  </td>
                  <td>
                    <div className="text-xs text-slate-700 font-medium">{project.implementingAgency || 'NHAI / MoRTH'}</div>
                    <div className="text-[10px] text-slate-400">Escalate to IPMD Taskforce</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => navigateToProject(project.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded transition"
                    >
                      View Details <ChevronRight size={13} />
                    </button>
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
