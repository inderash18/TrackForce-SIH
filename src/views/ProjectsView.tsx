import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  FileSpreadsheet,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { sectorSummaryList, ministrySummaryList } from '../data/nationalMetrics';

export const ProjectsView: React.FC = () => {
  const { projects, navigateToProject, showNotification, reportingMonth } = useApp();

  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [filterMinistry, setFilterMinistry] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState<'riskScore' | 'revisedCost' | 'physicalProgress' | 'expectedDelayMonths'>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        if (filterSector !== 'all' && p.sector !== filterSector) return false;
        if (filterMinistry !== 'all' && p.ministry !== filterMinistry) return false;
        if (filterRisk !== 'all' && p.riskLevel !== filterRisk) return false;
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
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [projects, search, filterSector, filterMinistry, filterRisk, filterStatus, sortField, sortAsc]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterSector('all');
    setFilterMinistry('all');
    setFilterRisk('all');
    setFilterStatus('all');
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
    const rows = filteredProjects.map(p => [
      p.code,
      `"${p.name}"`,
      p.sector,
      `"${p.ministry}"`,
      p.state,
      p.originalCost,
      p.revisedCost,
      p.expenditure,
      p.physicalProgress,
      p.riskScore,
      p.riskLevel,
      p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAIMANA_Projects_Registry_${reportingMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Exported ${filteredProjects.length} projects to CSV.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-hero-section">
        <div>
          <h1 className="page-hero-title">Infrastructure Projects Registry</h1>
          <p className="page-hero-subtitle">
            Search, filter, and inspect predictive metrics across Central Sector Infrastructure Schemes
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <FileSpreadsheet size={14} />
            Export CSV ({filteredProjects.length})
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search
              size={14}
              color="var(--color-text-secondary)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="gov-input"
              placeholder="Search by project name, code, state, or agency..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '32px', width: '100%' }}
            />
          </div>

          {/* Sector Filter */}
          <select
            className="gov-select"
            value={filterSector}
            onChange={e => setFilterSector(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Sectors</option>
            {sectorSummaryList.map(s => (
              <option key={s.sector} value={s.sector}>
                {s.sector}
              </option>
            ))}
          </select>

          {/* Ministry Filter */}
          <select
            className="gov-select"
            value={filterMinistry}
            onChange={e => setFilterMinistry(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="all">All Ministries</option>
            {ministrySummaryList.map(m => (
              <option key={m.ministry} value={m.ministry}>
                {m.ministry.split('(')[0].trim()}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            className="gov-select"
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            style={{ minWidth: '130px' }}
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical Risk</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk / Safe</option>
          </select>

          {/* Status Filter */}
          <select
            className="gov-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ minWidth: '130px' }}
          >
            <option value="all">All Project Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Delayed">Delayed</option>
            <option value="Critical Review">Critical Review</option>
            <option value="Near Completion">Near Completion</option>
          </select>

          {/* Reset Filters */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleResetFilters}
            title="Reset Filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* Active Filter Counter */}
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            Showing <strong>{filteredProjects.length}</strong> matching projects in <strong>{reportingMonth}</strong>
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            Sorted by {sortField} ({sortAsc ? 'Ascending' : 'Descending'})
          </span>
        </div>
      </div>

      {/* Projects Table */}
      <div className="gov-table-container">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Project Code</th>
              <th>Project Name & Agency</th>
              <th>Sector</th>
              <th>Ministry</th>
              <th
                onClick={() => handleSort('revisedCost')}
                style={{ cursor: 'pointer', textAlign: 'right' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <span>Revised Cost</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ textAlign: 'right' }}>Expenditure</th>
              <th
                onClick={() => handleSort('physicalProgress')}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span>Progress</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th
                onClick={() => handleSort('riskScore')}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <span>Risk Score</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
                  No projects match the current filter criteria. Try resetting the filters.
                </td>
              </tr>
            ) : (
              filteredProjects.map(p => (
                <tr
                  key={p.id}
                  className="interactive-row"
                  onClick={() => navigateToProject(p.id)}
                >
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {p.code}
                  </td>
                  <td>
                    <div>
                      <strong style={{ color: 'var(--color-text-dark)', fontSize: '13px', display: 'block' }}>
                        {p.name}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {p.implementingAgency} • {p.state}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{p.sector}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {p.ministry.replace('Ministry of ', '')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    ₹{p.revisedCost.toLocaleString()} Cr
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                    ₹{p.expenditure.toLocaleString()} Cr
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '12.5px' }}>{p.physicalProgress}%</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Gap: -{p.progressGap}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color:
                          p.riskLevel === 'critical'
                            ? 'var(--status-critical-text)'
                            : p.riskLevel === 'high'
                            ? 'var(--status-high-text)'
                            : p.riskLevel === 'medium'
                            ? 'var(--status-medium-text)'
                            : 'var(--status-low-text)'
                      }}
                    >
                      {p.riskScore}
                    </span>
                  </td>
                  <td>
                    <StatusBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', fontSize: '11.5px' }}
                      onClick={e => {
                        e.stopPropagation();
                        navigateToProject(p.id);
                      }}
                    >
                      View Intelligence →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
