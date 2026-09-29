import React, { useState } from 'react';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import { useApp } from '../context/AppContext';
import { Download, Calendar, Search } from 'lucide-react';
import { generateOfficialPDF } from '../utils/pdfGenerator';
const DOCUMENTS_LIST = [
    {
        sNo: 1,
        subject: 'Central Upload Format (CUF) 2026 Technical Specification & Schema Guidelines',
        category: 'User Manual / Guideline',
        issueDate: '15 Jan 2026',
        documentNo: 'MoSPI/IPMD/CUF-2026/01',
        fileSize: '2.4 MB'
    },
    {
        sNo: 2,
        subject: 'Revised Threshold Criteria for Central Sector Mega Infrastructure Project Reporting (₹ 150 Cr & Above)',
        category: 'Order / Circular',
        issueDate: '01 Dec 2025',
        documentNo: 'MoSPI/IPMD/POLICY/2025/12',
        fileSize: '1.8 MB'
    },
    {
        sNo: 3,
        subject: 'Standard Operating Procedure (SOP) for Online Central Monitoring System (OCMS) Data Verification',
        category: 'User Manual / Guideline',
        issueDate: '10 Oct 2025',
        documentNo: 'MoSPI/OCMS/SOP-03',
        fileSize: '3.1 MB'
    },
    {
        sNo: 4,
        subject: 'Advisory on Mandatory Integration of PM GatiShakti GIS Coordinates in Monthly Flash Submissions',
        category: 'Order / Circular',
        issueDate: '20 Aug 2025',
        documentNo: 'MoSPI/GATISHAKTI/2025/08',
        fileSize: '1.2 MB'
    },
    {
        sNo: 5,
        subject: 'Guidelines for Milestone Stagnation Flagging & Early Warning Escalation Matrix',
        category: 'User Manual / Guideline',
        issueDate: '15 May 2025',
        documentNo: 'MoSPI/IPMD/ALERT-GUIDELINES/2025',
        fileSize: '2.1 MB'
    }
];
export const OrdersAndManualsView = ({ onNavigate, onOpenAddProject, onOpenLoginModal }) => {
    const { showNotification } = useApp();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [downloadingNo, setDownloadingNo] = useState(null);

    const handleDownload = (doc) => {
        try {
            setDownloadingNo(doc.documentNo);
            const fileName = generateOfficialPDF({
                title: doc.subject,
                documentNo: doc.documentNo,
                category: doc.category,
                issueDate: doc.issueDate,
                fileSize: doc.fileSize,
                description: `Statutory Publication and Operational Directive issued under IPMD MoSPI: ${doc.subject}. Reference No: ${doc.documentNo}. Issued on: ${doc.issueDate}.`
            });
            if (showNotification) {
                showNotification(`Downloaded statutory document: ${fileName}`);
            }
        } catch (err) {
            console.error('Error downloading document PDF:', err);
        } finally {
            setTimeout(() => setDownloadingNo(null), 600);
        }
    };
    const filteredDocs = DOCUMENTS_LIST.filter((d) => {
        if (selectedCategory !== 'All' && d.category !== selectedCategory)
            return false;
        if (search && !d.subject.toLowerCase().includes(search.toLowerCase()) && !d.documentNo.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }
        return true;
    });
    return (<div className="paimana-portal-wrapper">
      <PaimanaHeader activeRoute="orders-manuals" onNavigate={onNavigate} onOpenAddProject={onOpenAddProject} onOpenLoginModal={onOpenLoginModal}/>

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
        <div className="paimana-section-container" style={{ paddingTop: '32px' }}>
          {/* Header */}
          <div className="paimana-reports-page-header">
            <div>
              <div className="paimana-heading-with-underline">
                <h1 className="paimana-reports-h1">Notifications, Orders & Manuals</h1>
                <div className="paimana-heading-line"/>
              </div>
              <p className="paimana-reports-lead">
                Official circulars, Central Upload Format guidelines, and operational manuals issued by IPMD, MoSPI.
              </p>
            </div>
          </div>

          {/* Filter Row */}
          <div className="paimana-pub-filter-card" style={{ marginBottom: '24px' }}>
            <div className="paimana-filter-grid-4">
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Category</label>
                <select className="paimana-dash-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="All">All Documents</option>
                  <option value="Order / Circular">Orders & Circulars</option>
                  <option value="User Manual / Guideline">User Manuals & Guidelines</option>
                </select>
              </div>

              <div className="paimana-filter-group" style={{ gridColumn: 'span 2' }}>
                <label className="paimana-filter-lbl">Search Documents</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" className="paimana-dash-select" placeholder="Search subject, document number..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingRight: '28px' }}/>
                  <Search size={14} style={{ position: 'absolute', right: '10px', top: '12px', color: '#94A3B8' }}/>
                </div>
              </div>
            </div>
          </div>

          {/* Navy Framed Table */}
          <div className="paimana-navy-table-frame">
            <div className="paimana-navy-frame-header">
              <span className="frame-title">Statutory Documents Register</span>
              <span className="frame-count tnum">{filteredDocs.length} Documents</span>
            </div>

            <div className="paimana-navy-table-wrapper">
              <table className="paimana-navy-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>S.No</th>
                    <th style={{ width: '180px' }}>Document No.</th>
                    <th>Subject & Scope</th>
                    <th style={{ width: '150px' }}>Category</th>
                    <th style={{ width: '130px' }}>Issue Date</th>
                    <th style={{ width: '130px', textAlign: 'center' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((d) => (<tr key={d.sNo}>
                      <td className="tnum" style={{ fontWeight: 600 }}>{d.sNo}</td>
                      <td className="tnum font-mono" style={{ fontSize: '11.5px', color: '#0084C7' }}>{d.documentNo}</td>
                      <td>
                        <strong style={{ color: '#0F172A', fontSize: '13.5px' }}>{d.subject}</strong>
                      </td>
                      <td>
                        <span className={`paimana-badge-simple ${d.category.includes('Order') ? 'warning' : 'info'}`}>
                          {d.category}
                        </span>
                      </td>
                      <td className="tnum" style={{ fontSize: '12px', color: '#64748B' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} color="#0084C7"/> {d.issueDate}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button type="button" className="paimana-action-btn-dl" onClick={() => handleDownload(d)} title={`Download ${d.subject}`}>
                          <Download size={13}/> {downloadingNo === d.documentNo ? 'Saving...' : `PDF (${d.fileSize})`}
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <PaimanaFooter onNavigate={onNavigate}/>
    </div>);
};
