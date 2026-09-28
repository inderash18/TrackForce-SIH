import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Calendar, Sparkles, ChevronRight } from 'lucide-react';
const PUBLICATIONS_LIST = [
    {
        id: 'pub-01',
        category: 'Project Monitoring',
        title: 'Monthly Flash Report',
        period: 'March 2026',
        isNew: true,
        fileSize: '4.8 MB',
        pdfPath: '/docs/FlashReport_March_2026.pdf',
        description: 'Statutory executive flash report on 1,980+ Central Sector Projects costing ₹ 150 Crore and above.'
    },
    {
        id: 'pub-02',
        category: 'Performance Monitoring',
        title: 'Monthly Review Report',
        period: 'January 2026',
        isNew: true,
        fileSize: '3.9 MB',
        pdfPath: '/docs/Review_Report_Jan2026.pdf',
        description: 'Comprehensive inter-ministerial performance and milestone compliance assessment.'
    },
    {
        id: 'pub-03',
        category: 'Project Monitoring',
        title: 'Monthly Flash Report',
        period: 'February 2026',
        isNew: false,
        fileSize: '4.6 MB',
        pdfPath: '/docs/FlashReport_Feb_2026.pdf',
        description: 'Time & cost overrun analysis across Railway, Road, Petroleum, and Power sectors.'
    },
    {
        id: 'pub-04',
        category: 'Project Monitoring',
        title: 'Monthly Flash Report',
        period: 'January 2026',
        isNew: false,
        fileSize: '4.5 MB',
        pdfPath: '/docs/FlashReport_Jan_2026.pdf',
        description: 'Historical project milestone velocity audit and delay attribution breakdown.'
    },
    {
        id: 'pub-05',
        category: 'Performance Monitoring',
        title: 'Monthly Review Report',
        period: 'December 2025',
        isNew: false,
        fileSize: '3.7 MB',
        pdfPath: '/docs/Review_Report_Dec2025.pdf',
        description: 'Year-end infrastructure capital deployment and expenditure status report.'
    }
];
export const WhatsNewSection = () => {
    const { navigateTo } = useApp();
    const [activeFilter, setActiveFilter] = useState('all');
    const [downloadingId, setDownloadingId] = useState(null);
    const filteredPublications = activeFilter === 'all'
        ? PUBLICATIONS_LIST
        : PUBLICATIONS_LIST.filter((p) => p.category === activeFilter);
    const handleDownload = (pub) => {
        setDownloadingId(pub.id);
        setTimeout(() => {
            setDownloadingId(null);
            navigateTo('reports');
        }, 400);
    };
    return (<section id="whats-new" className="paimana-whatsnew-section" aria-labelledby="whatsnew-heading">
      <div className="paimana-section-container">
        {/* Section Header */}
        <div className="paimana-whatsnew-header">
          <div>
            <span className="paimana-section-kicker">Official MoSPI Publications</span>
            <h2 id="whatsnew-heading" className="paimana-section-title">
              What&apos;s New
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="paimana-filter-tabs" role="tablist" aria-label="Publication Category Filter">
            <button type="button" role="tab" aria-selected={activeFilter === 'all'} className={`paimana-filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
              All Reports
            </button>
            <button type="button" role="tab" aria-selected={activeFilter === 'Project Monitoring'} className={`paimana-filter-tab ${activeFilter === 'Project Monitoring' ? 'active' : ''}`} onClick={() => setActiveFilter('Project Monitoring')}>
              Project Monitoring
            </button>
            <button type="button" role="tab" aria-selected={activeFilter === 'Performance Monitoring'} className={`paimana-filter-tab ${activeFilter === 'Performance Monitoring' ? 'active' : ''}`} onClick={() => setActiveFilter('Performance Monitoring')}>
              Performance Monitoring
            </button>
          </div>
        </div>

        {/* Publications Grid */}
        <div className="paimana-publications-grid">
          {filteredPublications.map((pub) => (<div key={pub.id} className="paimana-pub-card">
              <div className="paimana-pub-top">
                <div className="paimana-pub-tag-row">
                  <span className={`paimana-pub-badge ${pub.category === 'Project Monitoring' ? 'badge-blue' : 'badge-navy'}`}>
                    [{pub.category}]
                  </span>
                  {pub.isNew && (<span className="paimana-pub-new-tag">
                      <Sparkles size={11}/> NEW
                    </span>)}
                </div>
                <div className="paimana-pub-period">
                  <Calendar size={13}/> {pub.period}
                </div>
              </div>

              <div className="paimana-pub-content">
                <h3 className="paimana-pub-title">{pub.title}</h3>
                <p className="paimana-pub-desc">{pub.description}</p>
              </div>

              <div className="paimana-pub-footer">
                <span className="paimana-pub-format">
                  <FileText size={14}/> PDF ({pub.fileSize})
                </span>
                <div className="paimana-pub-actions">
                  <button type="button" className="paimana-pub-btn-view" onClick={() => navigateTo('reports')} title="View report summary">
                    View
                  </button>
                  <button type="button" className="paimana-pub-btn-download" onClick={() => handleDownload(pub)} title="Download Official PDF">
                    <Download size={13}/>
                    {downloadingId === pub.id ? 'Opening...' : 'PDF'}
                  </button>
                </div>
              </div>
            </div>))}
        </div>

        {/* View All Button */}
        <div className="paimana-pub-view-all-row">
          <button type="button" className="paimana-pub-viewmore-btn" onClick={() => navigateTo('reports')}>
            <span>View All Flash Reports & Publications</span>
            <ChevronRight size={16}/>
          </button>
        </div>
      </div>
    </section>);
};
