import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Search,
  ArrowUpDown,
  RotateCcw,
  Download,
  ChevronRight,
  ChevronLeft,
  Building2,
  TrendingUp,
  CheckCircle2,
  Layers,
  MapPin,
  ShieldAlert
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (filterSector !== 'all' && p.sector !== filterSector) return false;
        if (filterMinistry !== 'all' && p.ministry !== filterMinistry) return false;
        if (filterRisk !== 'all' && p.riskLevel.toLowerCase() !== filterRisk.toLowerCase()) return false;
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

  // Overall KPI Metrics for Ribbon
  const metrics = useMemo(() => {
    const totalCount = filteredProjects.length;
    const totalOutlay = filteredProjects.reduce((sum, p) => sum + p.revisedCost, 0);
    const criticalCount = filteredProjects.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high').length;
    const avgProgress = totalCount > 0 ? (filteredProjects.reduce((sum, p) => sum + p.physicalProgress, 0) / totalCount).toFixed(1) : '0.0';

    return { totalCount, totalOutlay, criticalCount, avgProgress };
  }, [filteredProjects]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Project Name',
      'Sector',
      'Ministry',
      'State',
      'Implementing Agency',
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
      `"${p.implementingAgency.replace(/"/g, '""')}"`,
      p.originalCost,
      p.revisedCost,
      p.expenditure,
      p.physicalProgress,
      p.riskScore,
      p.riskLevel,
      p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PAIMANA_Projects_Registry_${reportingMonth.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Exported project inventory as CSV.');
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' };
      case 'delayed':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
      case 'critical review':
      case 'critical':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 75) return '#16A34A';
    if (progress >= 50) return '#0084C7';
    if (progress >= 25) return '#D97706';
    return '#EA580C';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      {/* 1. Executive Page Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #EBF4FC 0%, #F4F8FC 60%, #FFFFFF 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#0F172A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
          border: '1px solid #BAE6FD'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: '#E0F2FE',
                color: '#0369A1',
                border: '1px solid #BAE6FD'
              }}
            >
              <Layers size={13} />
              CENTRAL SECTOR INFRASTRUCTURE
            </span>
            <span
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                background: '#FFFFFF',
                color: '#475569',
                border: '1px solid #E2E8F0'
              }}
            >
              Cycle: {reportingMonth}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#0F172A' }}>
            Central Sector Projects Registry
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
            Active milestone surveillance, capex audits, and predictive risk profiling for ₹150 Cr+ central infrastructure packages across India.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 700,
              background: '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #0F172A',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#1E293B')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#0F172A')}
          >
            <Download size={14} />
            Export Registry (CSV)
          </button>
        </div>
      </div>

      {/* 2. Top 4 High-Impact KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Total Projects */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            border: '1px solid #BAE6FD',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Filtered Projects
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#0284C7',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0C4A6E', lineHeight: 1 }}>
              {metrics.totalCount.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11.5px', color: '#0369A1', marginTop: '6px', fontWeight: 600 }}>
              Central Infrastructure Packages
            </div>
          </div>
        </div>

        {/* Total Outlay */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Revised Outlay
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#D97706',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#78350F', lineHeight: 1 }}>
              ₹ {metrics.totalOutlay.toLocaleString('en-IN')} <span style={{ fontSize: '16px', fontWeight: 600 }}>Cr</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#92400E', marginTop: '6px', fontWeight: 600 }}>
              Sanctioned / Cumulative Outlay
            </div>
          </div>
        </div>

        {/* Critical & High Risk */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 100%)',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              High / Critical Risk
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert size={18} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7F1D1D', lineHeight: 1 }}>
              {metrics.criticalCount} <span style={{ fontSize: '15px', fontWeight: 600, color: '#991B1B' }}>Projects</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#DC2626', marginTop: '6px', fontWeight: 700 }}>
              Requires Active PMO/Ministry Intervention
            </div>
          </div>
        </div>

        {/* Average Physical Progress */}
        <div
          style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            border: '1px solid #BBF7D0',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Avg Physical Progress
            </span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#16A34A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#14532D', lineHeight: 1 }}>
              {metrics.avgProgress}%
            </div>
            <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '6px', fontWeight: 600 }}>
              Weighted Portfolio Milestone Progress
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #CBD5E1',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            alignItems: 'flex-end'
          }}
        >
          {/* Search Input */}
          <div style={{ gridColumn: 'span 2', minWidth: '240px' }}>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Search Projects
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by name, code, state, or agency..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  fontSize: '12.5px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A'
                }}
              />
            </div>
          </div>

          {/* Ministry Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Ministry
            </label>
            <select
              value={filterMinistry}
              onChange={(e) => {
                setFilterMinistry(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '9px 10px',
                fontSize: '12.5px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Ministries</option>
              {ministrySummaryList.map((m) => (
                <option key={m.ministry} value={m.ministry}>
                  {m.ministry}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Sector
            </label>
            <select
              value={filterSector}
              onChange={(e) => {
                setFilterSector(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '9px 10px',
                fontSize: '12.5px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Sectors</option>
              {sectorSummaryList.map((s) => (
                <option key={s.sector} value={s.sector}>
                  {s.sector}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Risk Level
            </label>
            <select
              value={filterRisk}
              onChange={(e) => {
                setFilterRisk(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '9px 10px',
                fontSize: '12.5px',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          {/* Status & Reset Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  fontSize: '12.5px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Delayed">Delayed</option>
                <option value="Critical Review">Critical Review</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              style={{
                marginTop: '22px',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Live Filter Counter Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748B',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '10px'
          }}
        >
          <div>
            Showing <strong style={{ color: '#0F172A', fontWeight: 700 }}>{filteredProjects.length}</strong> matching projects in portfolio
          </div>
          <div style={{ fontSize: '11.5px' }}>
            Sorted by <strong style={{ color: '#0084C7' }}>{sortField}</strong> ({sortAsc ? 'Ascending' : 'Descending'})
          </div>
        </div>
      </div>

      {/* 4. Projects Master Data Table (Clean White Card with Pale-Grey Header) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '2px solid #E2E8F0' }}>
                <th style={{ padding: '14px 16px', fontWeight: 800, minWidth: '260px' }}>
                  Project Details
                </th>
                <th style={{ padding: '14px 14px', fontWeight: 800, minWidth: '160px' }}>
                  Sector & Ministry
                </th>
                <th style={{ padding: '14px 14px', fontWeight: 800, minWidth: '120px' }}>
                  State / UT
                </th>
                <th
                  onClick={() => handleSort('revisedCost')}
                  style={{ padding: '14px 14px', fontWeight: 800, cursor: 'pointer', minWidth: '130px', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Outlay</span>
                    <ArrowUpDown size={13} color="#94A3B8" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('physicalProgress')}
                  style={{ padding: '14px 14px', fontWeight: 800, cursor: 'pointer', minWidth: '130px', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Progress</span>
                    <ArrowUpDown size={13} color="#94A3B8" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskScore')}
                  style={{ padding: '14px 14px', fontWeight: 800, cursor: 'pointer', minWidth: '110px', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Risk</span>
                    <ArrowUpDown size={13} color="#94A3B8" />
                  </div>
                </th>
                <th style={{ padding: '14px 14px', fontWeight: 800, minWidth: '120px' }}>
                  Status
                </th>
                <th style={{ padding: '14px 16px', fontWeight: 800, textAlign: 'center', minWidth: '100px' }}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                    No infrastructure projects match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project, idx) => {
                  const statusStyle = getStatusBadgeStyle(project.status);
                  const progColor = getProgressBarColor(project.physicalProgress);

                  return (
                    <tr
                      key={project.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F0F7FF')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF')}
                    >
                      {/* Project Name & Code */}
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          type="button"
                          onClick={() => navigateToProject(project.id)}
                          style={{
                            fontWeight: 700,
                            color: '#0F172A',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            textAlign: 'left',
                            fontSize: '13px',
                            cursor: 'pointer',
                            lineHeight: 1.4
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.color = '#0084C7')}
                          onMouseOut={(e) => (e.currentTarget.style.color = '#0F172A')}
                        >
                          {project.name}
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11px', color: '#64748B' }}>
                          <span style={{ padding: '2px 6px', background: '#F1F5F9', color: '#475569', fontFamily: 'monospace', fontWeight: 600, borderRadius: '4px' }}>
                            {project.code}
                          </span>
                          <span>•</span>
                          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {project.implementingAgency}
                          </span>
                        </div>
                      </td>

                      {/* Sector & Ministry */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '12.5px' }}>
                          {project.sector}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.ministry}
                        </div>
                      </td>

                      {/* State / UT */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11.5px',
                            color: '#334155',
                            fontWeight: 600,
                            background: '#F1F5F9',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          <MapPin size={12} color="#0084C7" />
                          {project.state}
                        </span>
                      </td>

                      {/* Revised Outlay */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>
                          ₹ {project.revisedCost.toLocaleString('en-IN')} Cr
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          Exp: ₹ {project.expenditure.toLocaleString('en-IN')} Cr
                        </div>
                      </td>

                      {/* Physical Progress */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{project.physicalProgress}%</span>
                            <span style={{ color: '#94A3B8' }}>100%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${project.physicalProgress}%`,
                                height: '100%',
                                backgroundColor: progColor,
                                borderRadius: '3px'
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td style={{ padding: '12px 14px' }}>
                        <StatusBadge level={project.riskLevel} customLabel={`${project.riskScore}/100`} size="sm" />
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`
                          }}
                        >
                          {project.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => navigateToProject(project.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: '#0F172A',
                            color: '#FFFFFF',
                            border: '1px solid #0F172A',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.background = '#1E293B')}
                          onMouseOut={(e) => (e.currentTarget.style.background = '#0F172A')}
                        >
                          <span>Dossier</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div
          style={{
            padding: '14px 22px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px',
            color: '#64748B'
          }}
        >
          <div>
            Showing <strong style={{ color: '#0F172A' }}>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong style={{ color: '#0F172A' }}>{Math.min(currentPage * pageSize, filteredProjects.length)}</strong> of{' '}
            <strong style={{ color: '#0F172A' }}>{filteredProjects.length}</strong> records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <ChevronLeft size={13} />
              Previous
            </button>

            <span
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#0F172A',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 700
              }}
            >
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
