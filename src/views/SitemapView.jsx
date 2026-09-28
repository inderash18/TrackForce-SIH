import React from 'react';
import { useApp } from '../context/AppContext';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import { Globe, FileText, Layers, Shield, Cpu, ChevronRight } from 'lucide-react';
export const SitemapView = ({ onNavigate, onOpenAddProject, onOpenLoginModal }) => {
    const { navigateTo } = useApp();
    const doNav = (route) => {
        if (onNavigate) {
            onNavigate(route);
        }
        else {
            navigateTo(route);
        }
    };
    const categories = [
        {
            title: 'Public Portal & Dashboards',
            color: '#0084C7',
            icon: <Globe size={20}/>,
            links: [
                { label: 'Portal Home (Main Landing)', route: 'landing', desc: 'Overview, hero photography, high value project showcase' },
                { label: 'Public Dashboard (MoSPI)', route: 'public-dashboard', desc: 'National summary cards, pastel metrics, 2x2 analytics panels' },
                { label: 'Projects Registry Directory', route: 'projects', desc: 'Searchable central sector inventory with status filtering' },
                { label: 'Geospatial GIS Map', route: 'map', desc: 'Interactive India map with project markers and risk levels' }
            ]
        },
        {
            title: 'Publications & Flash Reports',
            color: '#16A34A',
            icon: <FileText size={20}/>,
            links: [
                { label: 'Project Monitoring Reports', route: 'project-monitoring', desc: 'Statutory Monthly Flash Reports on ₹ 150 Cr+ schemes' },
                { label: 'Performance Monitoring Reports', route: 'performance-monitoring', desc: 'Monthly Performance Review Reports and compliance audits' },
                { label: 'Archive: Project Monitoring', route: 'archive-project-monitoring', desc: 'Historical Flash Report records and dossiers' },
                { label: 'Archive: Performance Monitoring', route: 'archive-project-performance', desc: 'Historical review reports across financial years' }
            ]
        },
        {
            title: 'Predictive Intelligence & AI',
            color: '#7C3AED',
            icon: <Cpu size={20}/>,
            links: [
                { label: 'National Risk Monitor', route: 'risk-monitor', desc: 'Algorithmic milestone stagnation and delay scoring' },
                { label: 'Early Warning Signals Digest', route: 'alerts', desc: 'Active critical alerts with inter-ministerial escalation workflows' },
                { label: 'What-If Policy Simulator', route: 'simulator', desc: 'Scenario perturbation modeling (RoW %, Contractor Velocity)' },
                { label: 'Peer Benchmarking Lab', route: 'benchmarking', desc: 'Side-by-side project comparison against national averages' },
                { label: 'Sentinel AI Assistant (Qwen)', route: 'assistant', desc: 'Conversational grounded RAG infrastructure copilot' },
                { label: 'ML Model Performance Validation', route: 'model-performance', desc: 'XGBoost & LightGBM confusion matrix and ROC-AUC' }
            ]
        },
        {
            title: 'Institutional Mandate & Information',
            color: '#EA580C',
            icon: <Layers size={20}/>,
            links: [
                { label: 'About IPMD (MoSPI)', route: 'about-ipmd', desc: 'Mandate, monitoring scope, and responsibilities' },
                { label: 'About OCMS & Sentinel', route: 'about-ocms', desc: 'Online Central Monitoring System & CUF data exchange' },
                { label: 'Strategic Vision & GatiShakti', route: 'about-vision', desc: 'Zero-delay, zero-cost-overrun national infrastructure mission' },
                { label: 'Notifications, Orders & Manuals', route: 'orders-manuals', desc: 'CUF technical schemas, circulars, and SOP manuals' }
            ]
        },
        {
            title: 'Data Pipeline & System Administration',
            color: '#0F172A',
            icon: <Shield size={20}/>,
            links: [
                { label: 'Data Management (CUF Ingestion)', route: 'data', desc: 'Monthly CUF progress ingestion, confidence audit' },
                { label: 'System Administration & RBAC', route: 'admin', desc: 'User clearances, role matrix, and security logs' },
                { label: 'Official Government Sign In', route: 'login', desc: 'AES-256 JWT secured officer authentication' },
                { label: 'Frequently Asked Questions (FAQ)', route: 'faq', desc: 'Common queries on flash reports, thresholds, and metrics' },
                { label: 'Contact Us (IPMD Directory)', route: 'contact', desc: 'Khurshid Lal Bhawan Janpath location map and email' }
            ]
        }
    ];
    return (<div className="paimana-portal-wrapper">
      <PaimanaHeader activeRoute="sitemap" onNavigate={onNavigate} onOpenAddProject={onOpenAddProject} onOpenLoginModal={onOpenLoginModal}/>

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
        <div className="paimana-section-container" style={{ paddingTop: '32px' }}>
          {/* Header */}
          <div className="paimana-reports-page-header">
            <div>
              <div className="paimana-heading-with-underline">
                <h1 className="paimana-reports-h1">PAIMANA Portal Site Map</h1>
                <div className="paimana-heading-line"/>
              </div>
              <p className="paimana-reports-lead">
                Comprehensive index of public dashboards, statutory publications, predictive analytics modules, and institutional guidelines.
              </p>
            </div>
          </div>

          {/* Grouped Category Cards with Distinct Category Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {categories.map((cat) => (<div key={cat.title} className="paimana-white-card" style={{
                borderTop: `4px solid ${cat.color}`,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ color: cat.color }}>{cat.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {cat.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {cat.links.map((link) => (<div key={link.label} onClick={() => doNav(link.route)} className="paimana-sitemap-link-card" role="button" tabIndex={0}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ fontSize: '13px', color: '#0084C7' }}>{link.label}</strong>
                        <ChevronRight size={14} color="#94A3B8"/>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                        {link.desc}
                      </p>
                    </div>))}
                </div>
              </div>))}
          </div>
        </div>
      </main>

      <PaimanaFooter onNavigate={onNavigate}/>
    </div>);
};
