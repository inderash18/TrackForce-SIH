import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import {
  Download,
  Filter,
  BarChart3,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { ministrySummaryList, sectorSummaryList, stateRiskBreakdown } from '../data/nationalMetrics';
import type { ActiveNavRoute } from '../types/project';

interface PublicDashboardViewProps {
  onNavigate?: (route: ActiveNavRoute) => void;
  onOpenAddProject?: () => void;
  onOpenLoginModal?: () => void;
}

export const PublicDashboardView: React.FC<PublicDashboardViewProps> = ({
  onNavigate,
  onOpenAddProject,
  onOpenLoginModal
}) => {
  const { projects, navigateToProject } = useApp();

  // Pending filter inputs (applied when clicking 'Show Data')
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCostCategory, setSelectedCostCategory] = useState<string>('All'); // 'All' | '>500' | '<=500'
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>('April 2026');

  // Applied filter state
  const [appliedFilters, setAppliedFilters] = useState({
    sector: 'All',
    ministry: 'All',
    state: 'All',
    costCategory: 'All',
    monthYear: 'April 2026'
  });

  // Independent Chart / Data toggles for the 4 panels
  const [panelViewMode, setPanelViewMode] = useState<{
    sector: 'chart' | 'data';
    cost: 'chart' | 'data';
    progress: 'chart' | 'data';
    state: 'chart' | 'data';
  }>({
    sector: 'chart',
    cost: 'chart',
    progress: 'chart',
    state: 'chart'
  });

  // Project Overview Modal state
  const [showOverviewModal, setShowOverviewModal] = useState<boolean>(false);
  const [modalSearch, setModalSearch] = useState<string>('');
  const [modalCurrentPage, setModalCurrentPage] = useState<number>(1);
  const modalPageSize = 10;

  // Filtered dataset based on applied filters
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (appliedFilters.sector !== 'All' && p.sector !== appliedFilters.sector) return false;
      if (appliedFilters.ministry !== 'All' && !p.ministry.includes(appliedFilters.ministry) && appliedFilters.ministry !== p.ministry) return false;
      if (appliedFilters.state !== 'All' && p.state !== appliedFilters.state) return false;
      if (appliedFilters.costCategory === '>500' && p.originalCost <= 500 && p.revisedCost <= 500) return false;
      if (appliedFilters.costCategory === '<=500' && (p.originalCost > 500 || p.revisedCost > 500)) return false;
      return true;
    });
  }, [projects, appliedFilters]);

  // Macro Totals
  const totalProjectCount = filteredProjects.length;
  const totalOriginalCost = filteredProjects.reduce((acc, p) => acc + p.originalCost, 0);
  const totalRevisedCost = filteredProjects.reduce((acc, p) => acc + p.revisedCost, 0);
  const totalExpenditure = filteredProjects.reduce((acc, p) => acc + p.expenditure, 0);

  // Physical progress distribution counts (4 standard bands)
  const progressBands = useMemo(() => {
    let b1 = 0; // 0 - 25%
    let b2 = 0; // 25 - 50%
    let b3 = 0; // 50 - 75%
    let b4 = 0; // 75 - 100%

    filteredProjects.forEach((p) => {
      const prog = p.physicalProgress;
      if (prog <= 25) b1++;
      else if (prog <= 50) b2++;
      else if (prog <= 75) b3++;
      else b4++;
    });

    return [
      { label: '0% – 25%', count: b1, color: '#86EFAC', darkColor: '#166534' },
      { label: '25% – 50%', count: b2, color: '#4ADE80', darkColor: '#15803D' },
      { label: '50% – 75%', count: b3, color: '#16A34A', darkColor: '#166534' },
      { label: '75% – 100%', count: b4, color: '#14532D', darkColor: '#052E16' }
    ];
  }, [filteredProjects]);

  // Sector breakdown data
  const sectorData = useMemo(() => {
    const map: Record<string, { count: number; cost: number }> = {};
    filteredProjects.forEach((p) => {
      if (!map[p.sector]) map[p.sector] = { count: 0, cost: 0 };
      map[p.sector].count++;
      map[p.sector].cost += p.revisedCost;
    });
    return Object.entries(map).map(([sector, val]) => ({
      sector,
      count: val.count,
      cost: val.cost,
      pct: totalProjectCount > 0 ? ((val.count / totalProjectCount) * 100).toFixed(1) : '0.0'
    }));
  }, [filteredProjects, totalProjectCount]);

  // State breakdown data
  const stateData = useMemo(() => {
    const map: Record<string, { count: number; cost: number }> = {};
    filteredProjects.forEach((p) => {
      if (!map[p.state]) map[p.state] = { count: 0, cost: 0 };
      map[p.state].count++;
      map[p.state].cost += p.revisedCost;
    });
    return Object.entries(map).map(([state, val]) => ({
      state,
      count: val.count,
      cost: val.cost,
      pct: totalProjectCount > 0 ? ((val.count / totalProjectCount) * 100).toFixed(1) : '0.0'
    }));
  }, [filteredProjects, totalProjectCount]);

  // Apply button click
  const handleShowData = () => {
    setAppliedFilters({
      sector: selectedSector,
      ministry: selectedMinistry,
      state: selectedState,
      costCategory: selectedCostCategory,
      monthYear: selectedMonthYear
    });
  };

  // CSV Export for Overview Modal
  const exportOverviewCSV = () => {
    const headers = [
      'S.No',
      'Sector',
      'Ministry',
      'Implementing Agency',
      'Project Code',
      'Project Name',
      'Original Cost (Cr)',
      'Revised Cost (Cr)',
      'Expenditure (Cr)',
      'Physical Progress (%)',
      'Original Commissioning Date',
      'Revised Commissioning Date',
      'Sanction Date'
    ];

    const rows = filteredProjects.map((p, idx) => [
      idx + 1,
      `"${p.sector}"`,
      `"${p.ministry}"`,
      `"${p.implementingAgency}"`,
      p.code || p.id,
      `"${p.name}"`,
      p.originalCost,
      p.revisedCost,
      p.expenditure,
      p.physicalProgress,
      p.originalCompletionDate,
      p.revisedCompletionDate || 'Under Review',
      'Sanctioned'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAIMANA_Project_Overview_${appliedFilters.monthYear.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modal pagination & search
  const modalFilteredList = useMemo(() => {
    if (!modalSearch) return filteredProjects;
    const q = modalSearch.toLowerCase();
    return filteredProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        p.sector.toLowerCase().includes(q) ||
        p.implementingAgency.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
    );
  }, [filteredProjects, modalSearch]);

  const modalTotalPages = Math.ceil(modalFilteredList.length / modalPageSize) || 1;
  const modalPaginatedList = modalFilteredList.slice(
    (modalCurrentPage - 1) * modalPageSize,
    modalCurrentPage * modalPageSize
  );

  return (
    <div className="paimana-portal-wrapper">
      {/* 3-Layer Government Header */}
      <PaimanaHeader 
        activeRoute="public-dashboard"
        onNavigate={onNavigate}
        onOpenAddProject={onOpenAddProject}
        onOpenLoginModal={onOpenLoginModal}
      />

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
        <div className="paimana-section-container" style={{ paddingTop: '28px' }}>
          {/* Top Title & Reporting Period */}
          <div className="paimana-dashboard-header-row">
            <div>
              <h1 className="paimana-pub-dash-title">
                Public Dashboard
              </h1>
              <span className="paimana-pub-dash-sub">
                Central Sector Infrastructure Projects Costing ₹ 150 Crore and Above
              </span>
            </div>

            <div className="paimana-dash-period-badge">
              <span>Reporting Period:</span>
              <strong>{appliedFilters.monthYear}</strong>
            </div>
          </div>

          {/* Desktop Filter Row: Sector, Ministry, State, Cost Category, Month/Year, Show Data */}
          <div className="paimana-pub-filter-card">
            <div className="paimana-filter-grid-5">
              {/* Sector */}
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Sector</label>
                <select
                  className="paimana-dash-select"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  <option value="All">All Sectors</option>
                  {sectorSummaryList.map((s) => (
                    <option key={s.sector} value={s.sector}>
                      {s.sector}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ministry */}
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Ministry / Department</label>
                <select
                  className="paimana-dash-select"
                  value={selectedMinistry}
                  onChange={(e) => setSelectedMinistry(e.target.value)}
                >
                  <option value="All">All Ministries</option>
                  {ministrySummaryList.map((m) => (
                    <option key={m.ministry} value={m.ministry}>
                      {m.ministry}
                    </option>
                  ))}
                </select>
              </div>

              {/* States / UTs */}
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">States / UTs</label>
                <select
                  className="paimana-dash-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="All">All States</option>
                  {stateRiskBreakdown.map((st) => (
                    <option key={st.state} value={st.state}>
                      {st.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Cost */}
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Project Cost</label>
                <select
                  className="paimana-dash-select"
                  value={selectedCostCategory}
                  onChange={(e) => setSelectedCostCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value=">500">Greater than 500 crore</option>
                  <option value="<=500">Up to & including 500 crore</option>
                </select>
              </div>

              {/* Month & Year */}
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Month & Year</label>
                <select
                  className="paimana-dash-select"
                  value={selectedMonthYear}
                  onChange={(e) => setSelectedMonthYear(e.target.value)}
                >
                  <option value="April 2026">April 2026</option>
                  <option value="March 2026">March 2026</option>
                  <option value="February 2026">February 2026</option>
                  <option value="January 2026">January 2026</option>
                  <option value="December 2025">December 2025</option>
                </select>
              </div>
            </div>

            <div className="paimana-filter-action-row">
              <button
                type="button"
                className="paimana-btn-show-data"
                onClick={handleShowData}
              >
                <Filter size={14} /> Show Data
              </button>
            </div>
          </div>

          {/* 4 Pastel Summary Cards in One Row (Observed Reference Palette) */}
          <div className="paimana-pastel-cards-grid">
            {/* Card 1: Project Count (Light Aqua #E0F7FA) -> Opens Overview Modal! */}
            <div
              className="paimana-pastel-card aqua"
              onClick={() => setShowOverviewModal(true)}
              role="button"
              tabIndex={0}
              title="Click to open Project Overview Modal"
            >
              <div className="paimana-pastel-header">
                <span className="paimana-pastel-title">Project Count (in no.)</span>
                <span className="paimana-modal-pill-indicator">
                  <FolderOpen size={13} /> View Registry
                </span>
              </div>
              <div className="paimana-pastel-val tnum">
                {totalProjectCount.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 2: Original Approved Cost (Pale Yellow #FFF9C4) */}
            <div className="paimana-pastel-card yellow">
              <div className="paimana-pastel-header">
                <span className="paimana-pastel-title">Original Approved Cost (in cr.)</span>
              </div>
              <div className="paimana-pastel-val tnum">
                ₹ {totalOriginalCost.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 3: Latest Revised Cost (Pale Pink #FCE4EC) */}
            <div className="paimana-pastel-card pink">
              <div className="paimana-pastel-header">
                <span className="paimana-pastel-title">Latest Revised Cost (in cr.)</span>
              </div>
              <div className="paimana-pastel-val tnum">
                ₹ {totalRevisedCost.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Card 4: Cumulative Expenditure (Pale Cream #FFF8E1) */}
            <div className="paimana-pastel-card cream">
              <div className="paimana-pastel-header">
                <span className="paimana-pastel-title">Cumulative Expenditure (in cr.)</span>
              </div>
              <div className="paimana-pastel-val tnum">
                ₹ {totalExpenditure.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* 4 Analytics Panels in a 2-Column Grid */}
          <div className="paimana-2col-analytics-grid">
            {/* Panel 1: Sector-wise Distribution */}
            <div className="paimana-analytic-panel">
              <div className="paimana-panel-header">
                <h3 className="paimana-panel-title">Sector-wise Distribution</h3>
                <div className="paimana-panel-controls">
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.sector === 'chart' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, sector: 'chart' }))}
                  >
                    <BarChart3 size={14} /> Charts
                  </button>
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.sector === 'data' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, sector: 'data' }))}
                  >
                    <TableIcon size={14} /> Data
                  </button>
                </div>
              </div>

              <div className="paimana-panel-body">
                {panelViewMode.sector === 'chart' ? (
                  <div className="paimana-bar-chart-container">
                    {sectorData.map((item) => {
                      const barWidth = totalProjectCount > 0 ? (item.count / totalProjectCount) * 100 : 0;
                      return (
                        <div key={item.sector} className="paimana-bar-row">
                          <div className="paimana-bar-label" title={item.sector}>
                            {item.sector}
                          </div>
                          <div className="paimana-bar-track">
                            <div
                              className="paimana-bar-fill blue"
                              style={{ width: `${Math.max(4, barWidth)}%` }}
                            />
                          </div>
                          <div className="paimana-bar-count tnum">
                            {item.count} <span className="sub-pct">({item.pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="paimana-panel-table-wrap">
                    <table className="paimana-mini-table">
                      <thead>
                        <tr>
                          <th>Sector</th>
                          <th style={{ textAlign: 'right' }}>Projects</th>
                          <th style={{ textAlign: 'right' }}>Cost (₹ Cr)</th>
                          <th style={{ textAlign: 'right' }}>Share (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectorData.map((s) => (
                          <tr key={s.sector}>
                            <td>{s.sector}</td>
                            <td style={{ textAlign: 'right' }} className="tnum">{s.count}</td>
                            <td style={{ textAlign: 'right' }} className="tnum">₹ {s.cost.toLocaleString('en-IN')}</td>
                            <td style={{ textAlign: 'right' }} className="tnum">{s.pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Panel 2: Cost Overview (3 Stepped Blue Comparison Bands) */}
            <div className="paimana-analytic-panel">
              <div className="paimana-panel-header">
                <h3 className="paimana-panel-title">Cost Overview</h3>
                <div className="paimana-panel-controls">
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.cost === 'chart' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, cost: 'chart' }))}
                  >
                    <BarChart3 size={14} /> Charts
                  </button>
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.cost === 'data' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, cost: 'data' }))}
                  >
                    <TableIcon size={14} /> Data
                  </button>
                </div>
              </div>

              <div className="paimana-panel-body">
                {panelViewMode.cost === 'chart' ? (
                  <div className="paimana-cost-overview-chart">
                    {/* Stepped Band 1: Original Approved Cost */}
                    <div className="paimana-cost-band-item">
                      <div className="cost-band-meta">
                        <span className="cost-band-lbl">Original Approved Cost</span>
                        <strong className="cost-band-val tnum">₹ {totalOriginalCost.toLocaleString('en-IN')} Cr</strong>
                      </div>
                      <div className="cost-band-visual-bar bg-blue-1" style={{ width: '85%' }}>
                        <span className="band-caption">Sanctioned Outlay (100%)</span>
                      </div>
                    </div>

                    {/* Stepped Band 2: Latest Revised Cost */}
                    <div className="paimana-cost-band-item">
                      <div className="cost-band-meta">
                        <span className="cost-band-lbl">Latest Anticipated Cost</span>
                        <strong className="cost-band-val tnum">₹ {totalRevisedCost.toLocaleString('en-IN')} Cr</strong>
                      </div>
                      <div className="cost-band-visual-bar bg-blue-2" style={{ width: '100%' }}>
                        <span className="band-caption">
                          Escalation: +{totalOriginalCost > 0 ? (((totalRevisedCost - totalOriginalCost) / totalOriginalCost) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>

                    {/* Stepped Band 3: Cumulative Expenditure */}
                    <div className="paimana-cost-band-item">
                      <div className="cost-band-meta">
                        <span className="cost-band-lbl">Cumulative Expenditure</span>
                        <strong className="cost-band-val tnum">₹ {totalExpenditure.toLocaleString('en-IN')} Cr</strong>
                      </div>
                      <div
                        className="cost-band-visual-bar bg-blue-3"
                        style={{
                          width: `${Math.max(15, totalRevisedCost > 0 ? (totalExpenditure / totalRevisedCost) * 100 : 45)}%`
                        }}
                      >
                        <span className="band-caption">
                          Utilized: {totalRevisedCost > 0 ? ((totalExpenditure / totalRevisedCost) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="paimana-panel-table-wrap">
                    <table className="paimana-mini-table">
                      <thead>
                        <tr>
                          <th>Capital Parameter</th>
                          <th style={{ textAlign: 'right' }}>Amount (₹ Cr)</th>
                          <th style={{ textAlign: 'right' }}>Ratio (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Original Approved Outlay</td>
                          <td style={{ textAlign: 'right' }} className="tnum">₹ {totalOriginalCost.toLocaleString('en-IN')}</td>
                          <td style={{ textAlign: 'right' }} className="tnum">100.0%</td>
                        </tr>
                        <tr>
                          <td>Latest Anticipated Cost</td>
                          <td style={{ textAlign: 'right' }} className="tnum">₹ {totalRevisedCost.toLocaleString('en-IN')}</td>
                          <td style={{ textAlign: 'right' }} className="tnum">
                            +{totalOriginalCost > 0 ? (((totalRevisedCost - totalOriginalCost) / totalOriginalCost) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                        <tr>
                          <td>Cumulative Expenditure to Date</td>
                          <td style={{ textAlign: 'right' }} className="tnum">₹ {totalExpenditure.toLocaleString('en-IN')}</td>
                          <td style={{ textAlign: 'right' }} className="tnum">
                            {totalRevisedCost > 0 ? ((totalExpenditure / totalRevisedCost) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Panel 3: Physical Progress [Project Count] (Green Progress Bands) */}
            <div className="paimana-analytic-panel">
              <div className="paimana-panel-header">
                <h3 className="paimana-panel-title">Physical Progress [Project Count]</h3>
                <div className="paimana-panel-controls">
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.progress === 'chart' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, progress: 'chart' }))}
                  >
                    <BarChart3 size={14} /> Charts
                  </button>
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.progress === 'data' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, progress: 'data' }))}
                  >
                    <TableIcon size={14} /> Data
                  </button>
                </div>
              </div>

              <div className="paimana-panel-body">
                {panelViewMode.progress === 'chart' ? (
                  <div className="paimana-progress-bars-container">
                    {progressBands.map((band) => {
                      const heightPct = totalProjectCount > 0 ? (band.count / totalProjectCount) * 100 : 0;
                      return (
                        <div key={band.label} className="paimana-vbar-col">
                          <div className="paimana-vbar-count tnum">{band.count}</div>
                          <div className="paimana-vbar-track">
                            <div
                              className="paimana-vbar-fill"
                              style={{
                                height: `${Math.max(6, heightPct)}%`,
                                backgroundColor: band.color,
                                borderTop: `3px solid ${band.darkColor}`
                              }}
                            />
                          </div>
                          <div className="paimana-vbar-lbl">{band.label}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="paimana-panel-table-wrap">
                    <table className="paimana-mini-table">
                      <thead>
                        <tr>
                          <th>Progress Band</th>
                          <th style={{ textAlign: 'right' }}>Project Count</th>
                          <th style={{ textAlign: 'right' }}>Percentage (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressBands.map((b) => (
                          <tr key={b.label}>
                            <td>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '2px',
                                  backgroundColor: b.color,
                                  marginRight: '6px'
                                }}
                              />
                              {b.label}
                            </td>
                            <td style={{ textAlign: 'right' }} className="tnum">{b.count}</td>
                            <td style={{ textAlign: 'right' }} className="tnum">
                              {totalProjectCount > 0 ? ((b.count / totalProjectCount) * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Panel 4: State-wise Distribution [Project Count] (Multicolour Donut / Chart) */}
            <div className="paimana-analytic-panel">
              <div className="paimana-panel-header">
                <h3 className="paimana-panel-title">State-wise Distribution [Project Count]</h3>
                <div className="paimana-panel-controls">
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.state === 'chart' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, state: 'chart' }))}
                  >
                    <BarChart3 size={14} /> Charts
                  </button>
                  <button
                    type="button"
                    className={`paimana-chart-data-btn ${panelViewMode.state === 'data' ? 'active' : ''}`}
                    onClick={() => setPanelViewMode((p) => ({ ...p, state: 'data' }))}
                  >
                    <TableIcon size={14} /> Data
                  </button>
                </div>
              </div>

              <div className="paimana-panel-body">
                {panelViewMode.state === 'chart' ? (
                  <div className="paimana-state-donut-container">
                    <div className="paimana-state-donut-grid">
                      {stateData.slice(0, 8).map((st, i) => {
                        const colors = ['#0284C7', '#0D9488', '#E11D48', '#EA580C', '#D97706', '#7C3AED', '#2563EB', '#475569'];
                        const color = colors[i % colors.length];
                        return (
                          <div key={st.state} className="paimana-state-pill-item">
                            <span className="dot" style={{ backgroundColor: color }} />
                            <span className="state-name">{st.state}</span>
                            <span className="state-count tnum"><strong>{st.count}</strong> ({st.pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="paimana-panel-table-wrap">
                    <table className="paimana-mini-table">
                      <thead>
                        <tr>
                          <th>State / UT</th>
                          <th style={{ textAlign: 'right' }}>Projects</th>
                          <th style={{ textAlign: 'right' }}>Share (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stateData.map((st) => (
                          <tr key={st.state}>
                            <td>{st.state}</td>
                            <td style={{ textAlign: 'right' }} className="tnum">{st.count}</td>
                            <td style={{ textAlign: 'right' }} className="tnum">{st.pct}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <PaimanaFooter onNavigate={onNavigate} />

      {/* PROJECT OVERVIEW MODAL (Triggered when clicking Project Count Card) */}
      {showOverviewModal && (
        <div
          className="paimana-modal-backdrop"
          onClick={() => setShowOverviewModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="paimana-project-overview-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navy Modal Header Bar */}
            <div className="paimana-overview-modal-header">
              <div className="paimana-overview-title-group">
                <h3 className="paimana-overview-title">Project Overview</h3>
                <span className="paimana-overview-count-badge">
                  {modalFilteredList.length} Projects
                </span>
              </div>

              <div className="paimana-overview-header-actions">
                <button
                  type="button"
                  className="paimana-btn-modal-export"
                  onClick={exportOverviewCSV}
                  title="Export to Excel / CSV"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button
                  type="button"
                  className="paimana-overview-close-btn"
                  onClick={() => setShowOverviewModal(false)}
                  aria-label="Close dialog"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Filter / Search Bar inside Modal */}
            <div className="paimana-overview-search-bar">
              <input
                type="text"
                className="paimana-overview-search-input"
                placeholder="Search by project name, code, sector, agency, or state..."
                value={modalSearch}
                onChange={(e) => {
                  setModalSearch(e.target.value);
                  setModalCurrentPage(1);
                }}
              />
            </div>

            {/* Scrollable Table Area with Alternating Light Row Backgrounds */}
            <div className="paimana-overview-table-container">
              <table className="paimana-overview-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Sector</th>
                    <th>Line Ministry</th>
                    <th>Implementing Agency</th>
                    <th>Project Code</th>
                    <th>Project Name</th>
                    <th style={{ textAlign: 'right' }}>Original Cost (₹ Cr)</th>
                    <th style={{ textAlign: 'right' }}>Revised Cost (₹ Cr)</th>
                    <th style={{ textAlign: 'right' }}>Expenditure (₹ Cr)</th>
                    <th style={{ textAlign: 'right' }}>Physical Progress</th>
                    <th>Original Commissioning</th>
                    <th>Revised Commissioning</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modalPaginatedList.map((p, idx) => {
                    const rowNumber = (modalCurrentPage - 1) * modalPageSize + idx + 1;
                    return (
                      <tr key={p.id}>
                        <td className="tnum">{rowNumber}</td>
                        <td><span className="paimana-table-sector-tag">{p.sector}</span></td>
                        <td>{p.ministry}</td>
                        <td><strong>{p.implementingAgency}</strong></td>
                        <td className="tnum font-mono">{p.code || p.id}</td>
                        <td>
                          <span
                            className="paimana-table-proj-link"
                            onClick={() => {
                              setShowOverviewModal(false);
                              navigateToProject(p.id);
                            }}
                            title="Open project detail dossier"
                          >
                            {p.name}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} className="tnum">
                          ₹ {p.originalCost.toLocaleString('en-IN')}
                        </td>
                        <td style={{ textAlign: 'right' }} className="tnum">
                          ₹ {p.revisedCost.toLocaleString('en-IN')}
                        </td>
                        <td style={{ textAlign: 'right' }} className="tnum">
                          ₹ {p.expenditure.toLocaleString('en-IN')}
                        </td>
                        <td style={{ textAlign: 'right' }} className="tnum font-bold">
                          {p.physicalProgress.toFixed(1)}%
                        </td>
                        <td className="tnum">{p.originalCompletionDate}</td>
                        <td className="tnum">{p.revisedCompletionDate || 'Under Review'}</td>
                        <td>
                          <span className={`paimana-badge-simple ${p.status.toLowerCase().includes('delay') || p.status.toLowerCase().includes('critical') ? 'warning' : 'success'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {modalPaginatedList.length === 0 && (
                    <tr>
                      <td colSpan={13} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                        No infrastructure projects match the search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Pagination Footer */}
            <div className="paimana-overview-modal-footer">
              <div className="paimana-modal-page-info">
                Showing {(modalCurrentPage - 1) * modalPageSize + 1} to {Math.min(modalCurrentPage * modalPageSize, modalFilteredList.length)} of {modalFilteredList.length} entries
              </div>

              <div className="paimana-modal-page-controls">
                <button
                  type="button"
                  className="paimana-page-btn"
                  onClick={() => setModalCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={modalCurrentPage === 1}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="paimana-current-page-tag">
                  {modalCurrentPage} / {modalTotalPages}
                </span>
                <button
                  type="button"
                  className="paimana-page-btn"
                  onClick={() => setModalCurrentPage((prev) => Math.min(modalTotalPages, prev + 1))}
                  disabled={modalCurrentPage >= modalTotalPages}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
