import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw
} from 'lucide-react';
import { sectorSummaryList, ministrySummaryList } from '../data/nationalMetrics';

export const ProjectsView: React.FC = () => {
  const { projects, navigateToProject, user, showNotification, reportingMonth } = useApp();

  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterMinistry, setFilterMinistry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    code: '',
    name: '',
    sector: 'Roads & Highways',
    ministry: 'Ministry of Road Transport and Highways',
    state: 'Maharashtra',
    originalCost: 1500,
    revisedCost: 1650,
    expenditure: 800,
    physicalProgress: 45
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filterSector !== 'all' && p.sector !== filterSector) return false;
      if (filterRisk !== 'all' && p.riskLevel.toLowerCase() !== filterRisk.toLowerCase()) return false;
      if (filterMinistry !== 'all' && p.ministry !== filterMinistry) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.code.toLowerCase().includes(search.toLowerCase()) &&
        !p.state.toLowerCase().includes(search.toLowerCase()) &&
        !p.implementingAgency.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [projects, search, filterSector, filterRisk, filterMinistry, filterStatus]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilterCount =
    (filterMinistry !== 'all' ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0) +
    (filterSector !== 'all' ? 1 : 0) +
    (filterRisk !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSearch('');
    setFilterSector('all');
    setFilterRisk('all');
    setFilterMinistry('all');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Project Name',
      'Sector',
      'Ministry',
      'State',
      'Original Cost (Cr)',
      'Revised Cost (Cr)',
      'Expenditure (Cr)',
      'Physical Progress (%)',
      'Risk Score',
      'Risk Level',
      'Status'
    ];
    const rows = filteredProjects.map((p) => [
      p.code,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sector,
      `"${p.ministry.replace(/"/g, '""')}"`,
      p.state,
      p.originalCost,
      p.revisedCost,
      p.expenditure,
      p.physicalProgress,
      p.riskScore,
      p.riskLevel,
      p.status
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Projects_List_${reportingMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported project inventory to CSV.');
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(`New project ${newProjectForm.code || 'PRJ-NEW'} recorded and queued for monitoring.`);
    setShowAddProjectModal(false);
  };

  const canAddProject = user.isLoggedIn && (user.role === 'admin' || user.role === 'analyst' || user.role === 'officer');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header: Title + Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {filteredProjects.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Central sector infrastructure projects costing ₹150 Crore and above
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
            title="Download current filtered list as CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          {canAddProject && (
            <button
              type="button"
              onClick={() => setShowAddProjectModal(true)}
              className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              <span>Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search & 2 Primary Filters + "More filters" */}
      <div className="gov-card p-3 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2.5">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, code, state, or agency..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Primary Filter 1: Sector */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={filterSector}
              onChange={(e) => {
                setFilterSector(e.target.value);
                setCurrentPage(1);
              }}
              className="gov-select text-xs w-full py-1.5"
            >
              <option value="all">All Sectors</option>
              {sectorSummaryList.map((s) => (
                <option key={s.sector} value={s.sector}>
                  {s.sector}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Filter 2: Risk */}
          <div className="w-full md:w-40 shrink-0">
            <select
              value={filterRisk}
              onChange={(e) => {
                setFilterRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="gov-select text-xs w-full py-1.5"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium / Moderate</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* More Filters Button */}
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 shrink-0 ${
              showMoreFilters || activeFilterCount > 0 ? 'border-sky-400 text-sky-700 bg-sky-50' : ''
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>More Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Expandable "More filters" Tray */}
        {showMoreFilters && (
          <div className="pt-2.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 bg-slate-50/60 p-2.5 rounded-md">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Ministry / Department</label>
              <select
                value={filterMinistry}
                onChange={(e) => {
                  setFilterMinistry(e.target.value);
                  setCurrentPage(1);
                }}
                className="gov-select text-xs w-full py-1"
              >
                <option value="all">All Ministries</option>
                {ministrySummaryList.map((m) => (
                  <option key={m.ministry} value={m.ministry}>
                    {m.ministry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Project Status</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="gov-select text-xs w-full py-1"
              >
                <option value="all">All Statuses</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Delayed">Delayed</option>
                <option value="Critical Delay">Critical Delay</option>
                <option value="Near Completion">Near Completion</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-secondary text-xs w-full py-1.5 justify-center"
              >
                Clear Extra Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Clean Project Table */}
      <div className="gov-card p-0 overflow-hidden">
        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Progress</th>
                <th>Risk</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-sm">No projects match the selected filters.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="btn-secondary text-xs mt-2 inline-flex"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => navigateToProject(project.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td>
                      <div className="font-semibold text-slate-900 text-xs hover:text-sky-600 transition-colors">
                        {project.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {project.code} · {project.state} · {project.sector}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden shrink-0">
                          <div
                            style={{ width: `${project.physicalProgress}%` }}
                            className="h-full bg-sky-600 rounded-full"
                          />
                        </div>
                        <span className="tabular-nums text-xs font-semibold text-slate-700">
                          {project.physicalProgress}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge level={project.riskLevel} customLabel={`${project.riskScore}/100`} size="sm" />
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {project.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToProject(project.id);
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

        {/* Pagination Controls */}
        {filteredProjects.length > pageSize && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} projects
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="btn-secondary text-xs px-2.5 py-1 disabled:opacity-40"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <span className="px-2 font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary text-xs px-2.5 py-1 disabled:opacity-40"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Project Modal for Authorised Users */}
      {showAddProjectModal && (
        <div className="paimana-modal-backdrop" onClick={() => setShowAddProjectModal(false)}>
          <div className="paimana-modal-card max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header">
              <h3 className="text-base font-bold text-slate-900">Add New Infrastructure Project</h3>
              <button className="text-slate-400 hover:text-slate-700" onClick={() => setShowAddProjectModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddProjectSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRJ-2026-904"
                  value={newProjectForm.code}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, code: e.target.value })}
                  className="gov-input w-full py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full sanctioned project name"
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                  className="gov-input w-full py-1.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sector</label>
                  <select
                    value={newProjectForm.sector}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, sector: e.target.value })}
                    className="gov-select w-full py-1.5 text-xs"
                  >
                    {sectorSummaryList.map((s) => (
                      <option key={s.sector} value={s.sector}>
                        {s.sector}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={newProjectForm.state}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, state: e.target.value })}
                    className="gov-input w-full py-1.5 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Approved Cost (₹ Cr)</label>
                  <input
                    type="number"
                    min="150"
                    required
                    value={newProjectForm.originalCost}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, originalCost: parseFloat(e.target.value) || 0 })
                    }
                    className="gov-input w-full py-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Physical Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProjectForm.physicalProgress}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, physicalProgress: parseFloat(e.target.value) || 0 })
                    }
                    className="gov-input w-full py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-4 py-1.5">
                  Save & Ingest Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
