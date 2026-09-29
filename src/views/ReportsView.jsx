import React, { useState, useMemo } from 'react';
import { standardReportsList } from '../data/reportsData';
import { useApp } from '../context/AppContext';
import { Search, Download, Eye, PlusCircle, FileText, X } from 'lucide-react';
import { generateOfficialPDF } from '../utils/pdfGenerator';
export const ReportsView = () => {
    const { showNotification, reportingMonth, scopedProjects, user } = useApp();
    const [activeTab, setActiveTab] = useState('current');
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [previewReport, setPreviewReport] = useState(null);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generateForm, setGenerateForm] = useState({
        type: 'Monthly Flash Report',
        period: reportingMonth || 'September 2026',
        scope: user.isNationalOversight ? 'All Central Sector Projects (₹150 Cr+)' : `${user.ministry || 'Ministry'} Projects (₹150 Cr+)`,
        format: 'PDF'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    // Filtered reports
    const filteredReports = useMemo(() => {
        return standardReportsList.filter((r) => {
            const isArchive = r.frequency.toLowerCase().includes('annual') || r.lastGenerated.includes('2025');
            if (activeTab === 'current' && isArchive)
                return false;
            if (activeTab === 'archive' && !isArchive)
                return false;
            if (filterType !== 'all' && r.category !== filterType)
                return false;
            if (search &&
                !r.title.toLowerCase().includes(search.toLowerCase()) &&
                !r.description.toLowerCase().includes(search.toLowerCase()) &&
                !r.category.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [activeTab, filterType, search]);
    const handleDownload = (rep, format) => {
        if (format === 'PDF') {
            try {
                const fileName = generateOfficialPDF({
                    title: rep.title,
                    id: rep.id,
                    category: rep.category,
                    classification: rep.classification,
                    period: reportingMonth || 'FY 2025-2026',
                    description: rep.description,
                    totalCost: '₹3,42,850 Cr',
                    projectsMonitored: `${scopedProjects.length} Projects`,
                    criticalProjects: '184 Delayed'
                });
                showNotification(`Downloaded official PDF: ${fileName}`);
            } catch (err) {
                console.error('PDF generation error:', err);
                showNotification(`Failed to generate PDF for ${rep.title}`, 'error');
            }
        } else {
            // Generate CSV/XLSX text file
            const filename = `${rep.title.replace(/\s+/g, '_')}_${(reportingMonth || '2026').replace(/\s+/g, '_')}.csv`;
            const scopeLabel = user.isNationalOversight ? 'All Central Sector Projects (>150 Cr)' : `${user.ministry} Monitored Projects`;
            const content = `PAIMANA Infrastructure Intelligence Report\nTitle: ${rep.title}\nReporting Period: ${reportingMonth}\nGenerated: ${new Date().toLocaleDateString()}\nScope: ${scopeLabel}\nTotal Projects Monitored: ${scopedProjects.length}\nClassification: ${rep.classification}\n`;
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification(`Downloaded "${rep.title}" data export.`);
        }
    };
    const handleGenerateSubmit = (e) => {
        e.preventDefault();
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setShowGenerateModal(false);
            if (generateForm.format === 'PDF') {
                generateOfficialPDF({
                    title: `${generateForm.type} - Custom Executive Dossier`,
                    category: generateForm.type,
                    period: generateForm.period,
                    description: `Custom Generated Dossier for ${generateForm.scope}. Synthesized by PAIMANA Sentinel AI engine.`
                });
            }
            showNotification(`Generated official ${generateForm.type} for ${generateForm.period} (${generateForm.format}).`);
        }, 800);
    };
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header: Title + Primary Generate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {filteredReports.length} reports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive flash dossiers, statutory monthly summaries, and cabinet committee briefing packages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active / Archive Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
            <button type="button" className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'current' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`} onClick={() => setActiveTab('current')}>
              Current Reports
            </button>
            <button type="button" className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'archive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`} onClick={() => setActiveTab('archive')}>
              Archive
            </button>
          </div>

          <button type="button" onClick={() => setShowGenerateModal(true)} className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5">
            <PlusCircle size={14}/>
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-card p-3 flex flex-col md:flex-row md:items-center gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" placeholder="Search reports by title, category, or keyword..." value={search} onChange={(e) => setSearch(e.target.value)} className="gov-input pl-9 text-xs w-full py-1.5"/>
          {search && (<button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={12}/>
            </button>)}
        </div>

        <div className="w-full md:w-48 shrink-0">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="gov-select text-xs w-full py-1.5">
            <option value="all">All Report Categories</option>
            <option value="Statutory">Statutory Reports</option>
            <option value="Executive">Executive Briefings</option>
            <option value="Intelligence">AI & Risk Intelligence</option>
            <option value="Analytics">Sector Analytics</option>
          </select>
        </div>
      </div>

      {/* Compact List of Available Reports */}
      <div className="gov-card p-0 overflow-hidden">
        <div className="gov-table-wrapper" style={{ border: 'none' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Category</th>
                <th>Period</th>
                <th>Published Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (<tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-sm">No reports match the selected filters.</p>
                  </td>
                </tr>) : (filteredReports.map((rep) => (<tr key={rep.id} onClick={() => setPreviewReport(rep)} className="hover:bg-slate-50/80 cursor-pointer transition-colors">
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText size={15} className="text-sky-600 shrink-0"/>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs hover:text-sky-600 transition-colors">
                            {rep.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-lg">{rep.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {rep.category}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 font-medium">{rep.frequency}</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500 tabular-nums">{rep.lastGenerated}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={() => setPreviewReport(rep)} className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1" title="Preview report">
                          <Eye size={12}/> Preview
                        </button>
                        <button type="button" onClick={() => handleDownload(rep, 'PDF')} className="btn-secondary text-xs px-2.5 py-1 flex items-center gap-1 text-sky-700 bg-sky-50 border-sky-200" title="Download PDF">
                          <Download size={12}/> PDF
                        </button>
                      </div>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {previewReport && (<div className="paimana-modal-backdrop" onClick={() => setPreviewReport(null)}>
          <div className="paimana-modal-card max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-sky-600 uppercase">{previewReport.category}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{previewReport.title}</h3>
              </div>
              <button type="button" className="text-slate-400 hover:text-slate-700" onClick={() => setPreviewReport(null)}>
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs text-slate-700">
              <p className="text-slate-600 leading-relaxed m-0">{previewReport.description}</p>

              {/* Dossier Preview Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Coverage</span>
                  <strong className="text-sm text-slate-900">{scopedProjects.length} Projects</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Reporting Cycle</span>
                  <strong className="text-sm text-slate-900">{reportingMonth || 'Sep 2026'}</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Format & Length</span>
                  <strong className="text-sm text-slate-900">{previewReport.pages} Pages (PDF/XLSX)</strong>
                </div>
              </div>

              {/* Sample Table Preview */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 text-xs flex justify-between">
                  <span>Executive Key Summary</span>
                  <span>MoSPI IPMD Statutory Release</span>
                </div>
                <div className="p-3 space-y-2 text-[11.5px]">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span>Projects with Schedule Variance (&gt;3 Mos)</span>
                    <span className="font-bold text-red-600">42% of active packages</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span>Cumulative Cost Escalation</span>
                    <span className="font-bold text-slate-800">21.4% vs original sanction</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inter-Ministerial Interventions Pending</span>
                    <span className="font-bold text-amber-600">18 priority actions</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 flex-wrap">
                <button type="button" onClick={() => setPreviewReport(null)} className="btn-secondary text-xs px-3 py-1.5 flex-1 sm:flex-none">
                  Close
                </button>
                <button type="button" onClick={() => handleDownload(previewReport, 'CSV')} className="btn-secondary text-xs px-3 py-1.5 flex-1 sm:flex-none">
                  Export CSV
                </button>
                <button type="button" onClick={() => handleDownload(previewReport, 'PDF')} className="btn-primary text-xs px-4 py-1.5 flex-1 sm:flex-none">
                  Download Complete PDF
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Report Generation Modal */}
      {showGenerateModal && (<div className="paimana-modal-backdrop" onClick={() => setShowGenerateModal(false)}>
          <div className="paimana-modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header">
              <h3 className="text-base font-bold text-slate-900">Generate Custom Report</h3>
              <button type="button" className="text-slate-400 hover:text-slate-700" onClick={() => setShowGenerateModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleGenerateSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Report Type</label>
                <select value={generateForm.type} onChange={(e) => setGenerateForm({ ...generateForm, type: e.target.value })} className="gov-select w-full py-1.5 text-xs">
                  <option value="Monthly Flash Report">Monthly Flash Report</option>
                  <option value="High-Risk Infrastructure Watchlist">High-Risk Infrastructure Watchlist</option>
                  <option value="Sector-wise Progress & Cost Matrix">Sector-wise Progress & Cost Matrix</option>
                  <option value="Cabinet Infrastructure Briefing">Cabinet Infrastructure Briefing</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reporting Period</label>
                <input type="text" value={generateForm.period} onChange={(e) => setGenerateForm({ ...generateForm, period: e.target.value })} className="gov-input w-full py-1.5 text-xs"/>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Scope</label>
                <select value={generateForm.scope} onChange={(e) => setGenerateForm({ ...generateForm, scope: e.target.value })} className="gov-select w-full py-1.5 text-xs">
                  <option value="All Central Sector Projects (₹150 Cr+)">All Central Sector Projects (₹150 Cr+)</option>
                  <option value="Railways & Highways Mega Projects">Railways & Highways Mega Projects</option>
                  <option value="Power, Coal & Petroleum Corridor">Power, Coal & Petroleum Corridor</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Format</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input type="radio" name="format" value="PDF" checked={generateForm.format === 'PDF'} onChange={() => setGenerateForm({ ...generateForm, format: 'PDF' })}/>
                    PDF Dossier
                  </label>
                  <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                    <input type="radio" name="format" value="CSV" checked={generateForm.format === 'CSV'} onChange={() => setGenerateForm({ ...generateForm, format: 'CSV' })}/>
                    CSV Data Package
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowGenerateModal(false)} className="btn-secondary text-xs px-3 py-1.5">
                  Cancel
                </button>
                <button type="submit" disabled={isGenerating} className="btn-primary text-xs px-4 py-1.5">
                  {isGenerating ? 'Compiling Report...' : 'Generate & Download'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
