import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import { FileText, Download, Calendar, Eye, Archive, ChevronLeft, ChevronRight, Search } from 'lucide-react';
const PROJECT_MONITORING_REPORTS = [
    {
        id: 'pm-2026-03',
        sNo: 1,
        financialYear: '2025-2026',
        monthQuarter: 'March 2026',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (March 2026)',
        fileSize: '4.8 MB',
        publishDate: '01 Apr 2026',
        isNew: true
    },
    {
        id: 'pm-2026-02',
        sNo: 2,
        financialYear: '2025-2026',
        monthQuarter: 'February 2026',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (February 2026)',
        fileSize: '4.6 MB',
        publishDate: '01 Mar 2026'
    },
    {
        id: 'pm-2026-01',
        sNo: 3,
        financialYear: '2025-2026',
        monthQuarter: 'January 2026',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (January 2026)',
        fileSize: '4.5 MB',
        publishDate: '01 Feb 2026'
    },
    {
        id: 'pm-2025-12',
        sNo: 4,
        financialYear: '2025-2026',
        monthQuarter: 'December 2025',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (December 2025)',
        fileSize: '4.4 MB',
        publishDate: '01 Jan 2026'
    },
    {
        id: 'pm-2025-11',
        sNo: 5,
        financialYear: '2025-2026',
        monthQuarter: 'November 2025',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (November 2025)',
        fileSize: '4.3 MB',
        publishDate: '01 Dec 2025'
    },
    {
        id: 'pm-2025-q2',
        sNo: 6,
        financialYear: '2025-2026',
        monthQuarter: 'Q2 (Jul - Sep 2025)',
        reportType: 'Quarterly Progress Report',
        title: 'Quarterly Executive Dossier on Mega Projects Costing ₹ 1,000 Cr & Above (Q2 FY26)',
        fileSize: '7.2 MB',
        publishDate: '15 Oct 2025'
    },
    {
        id: 'pm-2025-03',
        sNo: 7,
        financialYear: '2024-2025',
        monthQuarter: 'March 2025',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (March 2025)',
        fileSize: '4.7 MB',
        publishDate: '01 Apr 2025',
        isArchive: true
    },
    {
        id: 'pm-2024-12',
        sNo: 8,
        financialYear: '2024-2025',
        monthQuarter: 'December 2024',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (December 2024)',
        fileSize: '4.5 MB',
        publishDate: '01 Jan 2025',
        isArchive: true
    },
    {
        id: 'pm-2024-03',
        sNo: 9,
        financialYear: '2023-2024',
        monthQuarter: 'March 2024',
        reportType: 'Monthly Flash Report',
        title: 'Monthly Flash Report on Central Sector Projects Costing ₹ 150 Cr & Above (March 2024)',
        fileSize: '4.2 MB',
        publishDate: '01 Apr 2024',
        isArchive: true
    }
];
export const ProjectMonitoringReportsView = ({ isArchiveMode = false, onNavigate, onOpenAddProject, onOpenLoginModal }) => {
    const { navigateTo } = useApp();
    const [selectedType, setSelectedType] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [previewReport, setPreviewReport] = useState(null);
    const doNav = (route) => {
        if (onNavigate) {
            onNavigate(route);
        }
        else {
            navigateTo(route);
        }
    };
    const filteredReports = PROJECT_MONITORING_REPORTS.filter((r) => {
        if (isArchiveMode && !r.isArchive && r.financialYear === '2025-2026')
            return false;
        if (!isArchiveMode && r.isArchive)
            return false;
        if (selectedType !== 'All' && r.reportType !== selectedType)
            return false;
        if (selectedYear !== 'All' && r.financialYear !== selectedYear)
            return false;
        if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && !r.monthQuarter.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    });
    const totalPages = Math.ceil(filteredReports.length / pageSize) || 1;
    const paginatedReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const handleDownload = (r) => {
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('download', `${r.id}_FlashReport.pdf`);
        alert(`Downloading Official MoSPI Document: ${r.title}`);
    };
    return (<div className="paimana-portal-wrapper">
      <PaimanaHeader activeRoute={isArchiveMode ? 'archive-project-monitoring' : 'project-monitoring'} onNavigate={onNavigate} onOpenAddProject={onOpenAddProject} onOpenLoginModal={onOpenLoginModal}/>

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
        <div className="paimana-section-container" style={{ paddingTop: '32px' }}>
          {/* Header Row: Title on Left, Archive Link on Right */}
          <div className="paimana-reports-page-header">
            <div>
              <div className="paimana-heading-with-underline">
                <h1 className="paimana-reports-h1">
                  {isArchiveMode ? 'Archive: Project Monitoring Reports' : 'Project Monitoring Reports'}
                </h1>
                <div className="paimana-heading-line"/>
              </div>
              <p className="paimana-reports-lead">
                Monthly Flash Reports & Milestone Progress Dossiers under the Infrastructure and Project Monitoring Division (IPMD).
              </p>
            </div>

            <div className="paimana-reports-header-actions">
              {isArchiveMode ? (<button type="button" className="paimana-archive-link-btn" onClick={() => doNav('project-monitoring')}>
                  <FileText size={14}/> View Current Reports
                </button>) : (<button type="button" className="paimana-archive-link-btn" onClick={() => doNav('archive-project-monitoring')}>
                  <Archive size={14}/> Archive Report Project Monitoring
                </button>)}
            </div>
          </div>

          {/* Filter Bar: Report Type, Financial Year, Search, Page Size */}
          <div className="paimana-pub-filter-card" style={{ marginBottom: '24px' }}>
            <div className="paimana-filter-grid-4">
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Report Type</label>
                <select className="paimana-dash-select" value={selectedType} onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
        }}>
                  <option value="All">All Types</option>
                  <option value="Monthly Flash Report">Monthly Flash Report</option>
                  <option value="Quarterly Progress Report">Quarterly Progress Report</option>
                </select>
              </div>

              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Financial Year</label>
                <select className="paimana-dash-select" value={selectedYear} onChange={(e) => {
            setSelectedYear(e.target.value);
            setCurrentPage(1);
        }}>
                  <option value="All">All Financial Years</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                </select>
              </div>

              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Search Documents</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="paimana-dash-select" placeholder="Search title, month..." value={searchQuery} onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
        }} style={{ paddingRight: '28px' }}/>
                  <Search size={14} style={{ position: 'absolute', right: '10px', top: '12px', color: '#94A3B8' }}/>
                </div>
              </div>

              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Entries per Page</label>
                <select className="paimana-dash-select" value={pageSize} onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
        }}>
                  <option value="10">10 entries</option>
                  <option value="25">25 entries</option>
                  <option value="50">50 entries</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navy Outlined Table Container with Rounded Upper Corners and Navy Top Band */}
          <div className="paimana-navy-table-frame">
            <div className="paimana-navy-frame-header">
              <span className="frame-title">
                {isArchiveMode ? 'Historical Archive Registry' : 'Official MoSPI Flash Reports Publication Matrix'}
              </span>
              <span className="frame-count tnum">
                {filteredReports.length} Available Publications
              </span>
            </div>

            <div className="paimana-navy-table-wrapper">
              <table className="paimana-navy-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>S.No</th>
                    <th style={{ width: '140px' }}>Financial Year</th>
                    <th style={{ width: '180px' }}>Month / Quarter</th>
                    <th>Report Title & Scope</th>
                    <th style={{ width: '110px' }}>File Size</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((r) => (<tr key={r.id}>
                      <td className="tnum" style={{ fontWeight: 600 }}>{r.sNo}</td>
                      <td className="tnum font-semibold">{r.financialYear}</td>
                      <td>
                        <div className="paimana-pub-month-cell">
                          <Calendar size={13} color="#0084C7"/>
                          <span>{r.monthQuarter}</span>
                          {r.isNew && <span className="paimana-tag-new">NEW</span>}
                        </div>
                      </td>
                      <td>
                        <div className="paimana-report-title-cell">
                          <strong className="title-text">{r.title}</strong>
                          <span className="meta-sub">Published: {r.publishDate} · IPMD Central Sector Database</span>
                        </div>
                      </td>
                      <td className="tnum" style={{ color: '#64748B', fontSize: '12px' }}>{r.fileSize}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="paimana-table-actions-row">
                          <button type="button" className="paimana-action-btn-view" onClick={() => setPreviewReport(r)} title="Preview Flash Report Summary">
                            <Eye size={13}/> View
                          </button>
                          <button type="button" className="paimana-action-btn-dl" onClick={() => handleDownload(r)} title="Download Official PDF">
                            <Download size={13}/> PDF
                          </button>
                        </div>
                      </td>
                    </tr>))}
                  {paginatedReports.length === 0 && (<tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                        No reports match the selected filters.
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Bar */}
            <div className="paimana-navy-table-footer">
              <span className="page-summary">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredReports.length)} of {filteredReports.length} records
              </span>

              <div className="paimana-pagination-controls">
                <button type="button" className="paimana-page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft size={16}/> Prev
                </button>
                <span className="paimana-current-page-tag">
                  {currentPage} / {totalPages}
                </span>
                <button type="button" className="paimana-page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                  Next <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PaimanaFooter onNavigate={onNavigate}/>

      {/* PDF Document Preview Modal */}
      {previewReport && (<div className="paimana-modal-backdrop" onClick={() => setPreviewReport(null)} role="dialog" aria-modal="true">
          <div className="paimana-modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#0084C7"/>
                <h3 className="paimana-modal-title">Official Document Dossier</h3>
              </div>
              <button type="button" className="paimana-modal-close" onClick={() => setPreviewReport(null)}>
                &times;
              </button>
            </div>

            <div className="paimana-modal-body">
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0084C7', textTransform: 'uppercase', marginBottom: '4px' }}>
                {previewReport.reportType} · FY {previewReport.financialYear}
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                {previewReport.title}
              </h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                This statutory report encapsulates milestone performance, expenditure ratios, and delay forecasting for 1,980+ Central Sector Projects costing ₹ 150 Crore and above under the IPMD MoSPI monitoring mandate.
              </p>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Reporting Period:</span>
                  <strong>{previewReport.monthQuarter}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>File Size / Format:</span>
                  <strong>{previewReport.fileSize} (Adobe PDF)</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Publication Date:</span>
                  <strong>{previewReport.publishDate}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block' }}>Classification:</span>
                  <strong style={{ color: '#16A34A' }}>Public Official Report</strong>
                </div>
              </div>
            </div>

            <div className="paimana-modal-footer">
              <button type="button" className="paimana-btn-navy-pill" onClick={() => handleDownload(previewReport)}>
                <Download size={14}/> Download Official PDF ({previewReport.fileSize})
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
