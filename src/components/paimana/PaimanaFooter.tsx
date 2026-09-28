import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react';

import type { ActiveNavRoute } from '../../types/project';

interface PaimanaFooterProps {
  onNavigate?: (route: ActiveNavRoute) => void;
}

export const PaimanaFooter: React.FC<PaimanaFooterProps> = ({ onNavigate }) => {
  const { navigateTo } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const doNav = (route: ActiveNavRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigateTo(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    if (type === 'home') {
      doNav('landing');
    } else if (type === 'dashboard') {
      doNav('public-dashboard');
    } else if (type === 'reports') {
      doNav('project-monitoring');
    } else if (type === 'contact') {
      doNav('contact');
    } else if (type === 'faq') {
      doNav('faq');
    } else if (type === 'sitemap') {
      doNav('sitemap');
    } else if (type === 'orders' || type === 'cuf') {
      doNav('orders-manuals');
    } else {
      setActiveModal(type);
    }
  };

  return (
    <footer id="contact-footer" className="paimana-footer-root" role="contentinfo">
      {/* Upper Main Footer Grid */}
      <div className="paimana-footer-main">
        <div className="paimana-section-container">
          <div className="paimana-footer-grid">
            {/* Column 1: Ministry / Institution Identity */}
            <div className="paimana-footer-col col-brand">
              <div className="paimana-footer-brand-title">
                <div className="paimana-emblem-small" aria-hidden="true">
                  <svg width="28" height="34" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 2C21.5 2 19.5 3.8 19.5 6C19.5 7.4 20.2 8.6 21.3 9.3C18 10.5 15 13.5 15 17.5C15 20.2 16.5 22.5 18.8 23.8C17 25 15.5 27 15.5 29.5C15.5 33 18.5 36 22 36.5V40H14C12.9 40 12 40.9 12 42V45H36V42C36 40.9 35.1 40 34 40H26V36.5C29.5 36 32.5 33 32.5 29.5C32.5 27 31 25 29.2 23.8C31.5 22.5 33 20.2 33 17.5C33 13.5 30 10.5 26.7 9.3C27.8 8.6 28.5 7.4 28.5 6C28.5 3.8 26.5 2 24 2Z" fill="#8B6F3E"/>
                    <path d="M10 47H38V51C38 52.1 37.1 53 36 53H12C10.9 53 10 52.1 10 51V47Z" fill="#1B365D"/>
                  </svg>
                </div>
                <div>
                  <h4 className="paimana-footer-heading">
                    Ministry of Statistics and Programme Implementation
                  </h4>
                  <span className="paimana-footer-sub">
                    Government of India · IPMD
                  </span>
                </div>
              </div>

              <p className="paimana-footer-about">
                The Infrastructure and Project Monitoring Division (IPMD) tracks the implementation status of Central Sector Infrastructure Projects costing ₹ 150 Crore and above across India.
              </p>
            </div>

            {/* Column 2: Get In Touch / Contact Details */}
            <div className="paimana-footer-col col-contact">
              <h4 className="paimana-footer-col-title">Get In Touch</h4>
              <div className="paimana-footer-contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>
                  Ministry of Statistics and Programme Implementation, Government of India, Khurshid Lal Bhawan, Janpath, New Delhi-110001 (India).
                </span>
              </div>

              <div className="paimana-footer-contact-item">
                <Phone size={16} className="contact-icon" />
                <a href="tel:01123455604" className="contact-link">
                  011-23455604
                </a>
              </div>

              <div className="paimana-footer-contact-item">
                <Mail size={16} className="contact-icon" />
                <a href="mailto:dir-ipmd@mospi.gov.in" className="contact-link">
                  dir-ipmd[at]mospi[dot]gov[dot]in
                </a>
              </div>
            </div>

            {/* Column 3: Quick Links */}
            <div className="paimana-footer-col col-links">
              <h4 className="paimana-footer-col-title">Quick Links</h4>
              <ul className="paimana-footer-nav-list">
                <li>
                  <a href="#home" onClick={(e) => handleLinkClick(e, 'home')}>
                    <ChevronRight size={13} /> Home
                  </a>
                </li>
                <li>
                  <a href="#dashboard" onClick={(e) => handleLinkClick(e, 'dashboard')}>
                    <ChevronRight size={13} /> Public Dashboard
                  </a>
                </li>
                <li>
                  <a href="#reports" onClick={(e) => handleLinkClick(e, 'reports')}>
                    <ChevronRight size={13} /> Monthly Flash Reports
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')}>
                    <ChevronRight size={13} /> Contact Us
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={(e) => handleLinkClick(e, 'faq')}>
                    <ChevronRight size={13} /> FAQs
                  </a>
                </li>
                <li>
                  <a href="#sitemap" onClick={(e) => handleLinkClick(e, 'sitemap')}>
                    <ChevronRight size={13} /> Site Map
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Compliance & Policies */}
            <div className="paimana-footer-col col-policies">
              <h4 className="paimana-footer-col-title">Policies & Standards</h4>
              <ul className="paimana-footer-nav-list">
                <li>
                  <a href="#hyperlink" onClick={(e) => handleLinkClick(e, 'hyperlink')}>
                    <ChevronRight size={13} /> Hyperlinking Policy
                  </a>
                </li>
                <li>
                  <a href="#privacy" onClick={(e) => handleLinkClick(e, 'privacy')}>
                    <ChevronRight size={13} /> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" onClick={(e) => handleLinkClick(e, 'terms')}>
                    <ChevronRight size={13} /> Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#cuf-guidelines" onClick={(e) => handleLinkClick(e, 'cuf')}>
                    <ChevronRight size={13} /> MoSPI CUF Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Copyright & Maintenance Strip */}
      <div className="paimana-footer-bottom">
        <div className="paimana-section-container">
          <div className="paimana-footer-bottom-inner">
            <p className="paimana-footer-copy">
              Content owned and maintained by: <strong>Infrastructure & Project Monitoring Division (IPMD)</strong> | Ministry of Statistics and Programme Implementation.
            </p>
            <p className="paimana-footer-subcopy">
              Copyright © 2026 Ministry of Statistics and Programme Implementation. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Informational Policy Modal for Footer Links */}
      {activeModal && (
        <div
          className="paimana-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="paimana-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header">
              <h3 className="paimana-modal-title">
                {activeModal === 'contact' && 'Contact Infrastructure & Project Monitoring Division'}
                {activeModal === 'faq' && 'Frequently Asked Questions (FAQs)'}
                {activeModal === 'sitemap' && 'PAIMANA Portal Site Map'}
                {activeModal === 'hyperlink' && 'Hyperlinking Policy'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Use & Compliance'}
                {activeModal === 'cuf' && 'MoSPI Central Upload Format (CUF) Guidelines'}
              </h3>
              <button
                type="button"
                className="paimana-modal-close"
                onClick={() => setActiveModal(null)}
              >
                &times;
              </button>
            </div>

            <div className="paimana-modal-body">
              {activeModal === 'contact' && (
                <div>
                  <p><strong>Infrastructure and Project Monitoring Division (IPMD)</strong></p>
                  <p>Ministry of Statistics & Programme Implementation, Khurshid Lal Bhawan, Janpath, New Delhi-110001.</p>
                  <p>Phone: <strong>011-23455604</strong></p>
                  <p>Email: <strong>dir-ipmd@mospi.gov.in</strong></p>
                  <p>Working Hours: Monday – Friday, 9:00 AM – 5:30 PM IST.</p>
                </div>
              )}

              {activeModal === 'faq' && (
                <div>
                  <p><strong>Q1: What is PAIMANA?</strong><br/>PAIMANA is the Central Sector Infrastructure Project monitoring portal developed for MoSPI to track mega projects costing ₹ 150 Cr & above.</p>
                  <p><strong>Q2: How often are flash reports published?</strong><br/>Monthly Flash Reports are compiled and published after inter-ministerial validation.</p>
                  <p><strong>Q3: How are delays calculated?</strong><br/>Milestone progress against original sanctioned and latest revised completion schedules.</p>
                </div>
              )}

              {activeModal === 'sitemap' && (
                <div>
                  <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                    <li>Home · Public Landing</li>
                    <li>Public Dashboard · National Infrastructure Health</li>
                    <li>Projects Inventory · Search & Filter 1,980+ Schemes</li>
                    <li>Risk Monitor · Early Warning Surveillance</li>
                    <li>Geospatial Intelligence · India GIS Map</li>
                    <li>What-If Scenario Simulator · Policy Intervention Modeling</li>
                    <li>Publications & Reports · Monthly Flash Reports & Dossiers</li>
                  </ul>
                </div>
              )}

              {(activeModal === 'hyperlink' || activeModal === 'privacy' || activeModal === 'terms' || activeModal === 'cuf') && (
                <div>
                  <p>In compliance with Government of India Guidelines for Indian Government Websites (GIGW) and MoSPI data governance directives.</p>
                  <p>Prior permission is required before hyperlinks are directed to this portal. All data presented is audited under the IPMD Flash Report validation pipeline.</p>
                </div>
              )}
            </div>

            <div className="paimana-modal-footer">
              <button
                type="button"
                className="paimana-btn-navy-pill"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
