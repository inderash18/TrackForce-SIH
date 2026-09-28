import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
export const PaimanaFooter = ({ onNavigate }) => {
    const { navigateTo } = useApp();
    const [activeModal, setActiveModal] = useState(null);
    const doNav = (route) => {
        if (onNavigate) {
            onNavigate(route);
        }
        else {
            navigateTo(route);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (<footer className="paimana-compact-footer" role="contentinfo">
      <div className="paimana-compact-footer-inner">
        {/* Left: Brand Identity & Government attribution */}
        <div className="compact-footer-brand">
          <span className="compact-footer-logo">PAIMANA</span>
          <span className="compact-footer-divider">|</span>
          <span className="compact-footer-sub">MoSPI IPMD · Government of India</span>
        </div>

        {/* Center: Inline Navigation Links */}
        <nav className="compact-footer-nav" aria-label="Footer links">
          <button type="button" onClick={() => doNav('landing')} className="compact-nav-link">
            Overview
          </button>
          <span className="dot">•</span>
          <button type="button" onClick={() => doNav('projects')} className="compact-nav-link">
            Projects
          </button>
          <span className="dot">•</span>
          <button type="button" onClick={() => doNav('project-monitoring')} className="compact-nav-link">
            Reports
          </button>
          <span className="dot">•</span>
          <button type="button" onClick={() => doNav('orders-manuals')} className="compact-nav-link">
            Orders & CUF
          </button>
          <span className="dot">•</span>
          <button type="button" onClick={() => doNav('faq')} className="compact-nav-link">
            FAQ
          </button>
          <span className="dot">•</span>
          <button type="button" onClick={() => doNav('contact')} className="compact-nav-link">
            Contact
          </button>
        </nav>

        {/* Right: Copyright & Privacy */}
        <div className="compact-footer-right">
          <span className="compact-copy">© {new Date().getFullYear()} MoSPI</span>
          <span className="dot">•</span>
          <button type="button" onClick={() => setActiveModal('privacy')} className="compact-legal-link">
            Privacy
          </button>
          <span className="dot">•</span>
          <button type="button" onClick={() => setActiveModal('terms')} className="compact-legal-link">
            Terms
          </button>
        </div>
      </div>

      {/* Modal Dialog for Policy Links */}
      {activeModal && (<div className="paimana-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="paimana-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header">
              <h3 className="text-lg font-semibold text-slate-900 capitalize">{activeModal} Information</h3>
              <button className="text-slate-400 hover:text-slate-700" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="paimana-modal-content text-sm text-slate-600 space-y-2 py-3">
              <p>
                Content hosted in compliance with Guidelines for Indian Government Websites (GIGW) and Ministry of Statistics and Programme Implementation standards.
              </p>
              <p>
                Contact IPMD at <strong>dir-ipmd@mospi.gov.in</strong> | Khurshid Lal Bhawan, Janpath, New Delhi - 110001.
              </p>
            </div>
            <div className="paimana-modal-actions pt-2 flex justify-end">
              <button className="btn-secondary text-xs px-4 py-1.5" onClick={() => setActiveModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>)}
    </footer>);
};
