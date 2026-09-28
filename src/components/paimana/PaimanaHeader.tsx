import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Menu,
  X,
  FileText,
  Activity,
  Layers,
  MapPin,
  Sliders,
  BarChart3
} from 'lucide-react';

import type { ActiveNavRoute } from '../../types/project';

interface PaimanaHeaderProps {
  fontSizeAdjustment?: number;
  setFontSizeAdjustment?: (val: number | ((prev: number) => number)) => void;
  isHighContrast?: boolean;
  setIsHighContrast?: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeRoute?: ActiveNavRoute;
  onNavigate?: (route: ActiveNavRoute) => void;
  onOpenAddProject?: () => void;
  onOpenLoginModal?: () => void;
}

export const PaimanaHeader: React.FC<PaimanaHeaderProps> = ({
  fontSizeAdjustment = 0,
  setFontSizeAdjustment,
  isHighContrast = false,
  setIsHighContrast,
  activeRoute: explicitActiveRoute,
  onNavigate,
  onOpenAddProject,
  onOpenLoginModal
}) => {
  const { navigateTo, user, activeRoute: contextActiveRoute } = useApp();
  const activeRoute = explicitActiveRoute || contextActiveRoute;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  const pubDropdownRef = useRef<HTMLLIElement>(null);
  const dashDropdownRef = useRef<HTMLLIElement>(null);
  const aboutDropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdowns on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pubDropdownRef.current && !pubDropdownRef.current.contains(e.target as Node) &&
        dashDropdownRef.current && !dashDropdownRef.current.contains(e.target as Node) &&
        aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (route: ActiveNavRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigateTo(route);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleFontSizeChange = (delta: number) => {
    if (setFontSizeAdjustment) {
      setFontSizeAdjustment((prev) => Math.max(-2, Math.min(4, prev + delta)));
    }
  };

  const handleContrastToggle = () => {
    if (setIsHighContrast) {
      setIsHighContrast((prev) => !prev);
    }
  };

  return (
    <header className="paimana-header-root" role="banner">
      {/* LAYER 1: Deep Navy Utility Strip (~30px high) */}
      <div className="paimana-utility-strip" aria-label="Accessibility and Language Controls">
        <div className="paimana-utility-container">
          <div className="paimana-utility-left">
            <a href="#main-content" className="paimana-skip-link">
              Skip to Main Content
            </a>
            <span className="paimana-utility-separator" aria-hidden="true">|</span>
            <span className="paimana-utility-text">
              {language === 'EN' ? 'Government of India' : 'भारत सरकार'} · MoSPI
            </span>
          </div>

          <div className="paimana-utility-right">
            {/* Screen Reader Access link */}
            <button
              type="button"
              className="paimana-util-btn"
              onClick={() => alert('Screen Reader Accessible. Semantic landmarks, ARIA labels, and keyboard tabs are enabled.')}
              title="Screen Reader Access"
              aria-label="Screen Reader Access"
            >
              Screen Reader
            </button>

            <span className="paimana-utility-separator" aria-hidden="true">|</span>

            {/* Font Size Adjusters */}
            <div className="paimana-font-controls" role="group" aria-label="Text Size Controls">
              <button
                type="button"
                className={`paimana-font-btn ${fontSizeAdjustment < 0 ? 'active' : ''}`}
                onClick={() => handleFontSizeChange(-1)}
                title="Decrease font size (A-)"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                className={`paimana-font-btn ${fontSizeAdjustment === 0 ? 'active' : ''}`}
                onClick={() => setFontSizeAdjustment && setFontSizeAdjustment(0)}
                title="Reset font size (A)"
                aria-label="Reset normal font size"
              >
                A
              </button>
              <button
                type="button"
                className={`paimana-font-btn ${fontSizeAdjustment > 0 ? 'active' : ''}`}
                onClick={() => handleFontSizeChange(1)}
                title="Increase font size (A+)"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>

            <span className="paimana-utility-separator" aria-hidden="true">|</span>

            {/* High Contrast Toggle */}
            <button
              type="button"
              className={`paimana-util-btn ${isHighContrast ? 'active' : ''}`}
              onClick={handleContrastToggle}
              title="Toggle High Contrast Mode"
              aria-pressed={isHighContrast}
              aria-label="Toggle High Contrast"
            >
              Contrast
            </button>

            <span className="paimana-utility-separator" aria-hidden="true">|</span>

            {/* Language Switcher */}
            <div className="paimana-lang-switch">
              <button
                type="button"
                className={`paimana-lang-btn ${language === 'EN' ? 'active' : ''}`}
                onClick={() => setLanguage('EN')}
                aria-label="English Language"
              >
                English
              </button>
              <button
                type="button"
                className={`paimana-lang-btn ${language === 'HI' ? 'active' : ''}`}
                onClick={() => setLanguage('HI')}
                aria-label="Hindi Language"
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 2: Identity & Primary Actions (~108px high, White Background) */}
      <div className="paimana-identity-strip">
        <div className="paimana-identity-container">
          {/* Institutional / Ministry Identity (Left) */}
          <div className="paimana-brand-left" onClick={() => handleNavClick('landing')}>
            {/* National Emblem Vector */}
            <div className="paimana-emblem-wrapper" aria-hidden="true">
              <svg width="44" height="52" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 2C21.5 2 19.5 3.8 19.5 6C19.5 7.4 20.2 8.6 21.3 9.3C18 10.5 15 13.5 15 17.5C15 20.2 16.5 22.5 18.8 23.8C17 25 15.5 27 15.5 29.5C15.5 33 18.5 36 22 36.5V40H14C12.9 40 12 40.9 12 42V45H36V42C36 40.9 35.1 40 34 40H26V36.5C29.5 36 32.5 33 32.5 29.5C32.5 27 31 25 29.2 23.8C31.5 22.5 33 20.2 33 17.5C33 13.5 30 10.5 26.7 9.3C27.8 8.6 28.5 7.4 28.5 6C28.5 3.8 26.5 2 24 2Z" fill="#8B6F3E"/>
                <path d="M10 47H38V51C38 52.1 37.1 53 36 53H12C10.9 53 10 52.1 10 51V47Z" fill="#1B365D"/>
                <circle cx="24" cy="49" r="2.5" fill="#C5A059"/>
                <path d="M21 54H27V55H21V54Z" fill="#8B6F3E"/>
              </svg>
            </div>

            <div className="paimana-brand-text">
              <span className="paimana-gov-title">
                {language === 'EN' ? 'Government of India' : 'भारत सरकार'}
              </span>
              <h1 className="paimana-ministry-title">
                {language === 'EN'
                  ? 'Ministry of Statistics and Programme Implementation'
                  : 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय'}
              </h1>
              <span className="paimana-division-title">
                {language === 'EN'
                  ? 'Infrastructure and Project Monitoring Division (IPMD)'
                  : 'अवसंरचना और परियोजना निगरानी प्रभाग (IPMD)'}
              </span>
            </div>
          </div>

          {/* Action Buttons & PAIMANA Logo (Right) */}
          <div className="paimana-actions-right">
            {/* Orange Pill Action: Add Project / Update */}
            <button
              type="button"
              className="paimana-btn-orange-pill"
              onClick={() => onOpenAddProject ? onOpenAddProject() : handleNavClick('login')}
              title="Add Project or Upload Monthly CUF Monitoring Data"
            >
              <span className="paimana-btn-dot" aria-hidden="true"></span>
              Add Project / Update
            </button>

            {/* Navy Gradient Pill Action: Reports */}
            <button
              type="button"
              className="paimana-btn-navy-pill"
              onClick={() => handleNavClick('project-monitoring')}
              title="Access Official Flash Reports and Portfolio Dossiers"
            >
              <FileText size={15} />
              Reports
            </button>

            {/* Official Sign In / Account Status */}
            {user.isLoggedIn ? (
              <button
                type="button"
                className="paimana-btn-login-pill logged-in"
                onClick={() => handleNavClick('dashboard')}
                title={`Signed in as ${user.name}`}
              >
                <span className="paimana-user-badge-dot"></span>
                <span>Workspace</span>
              </button>
            ) : (
              <button
                type="button"
                className="paimana-btn-login-pill"
                onClick={() => onOpenLoginModal ? onOpenLoginModal() : handleNavClick('login')}
                title="Official Portal Sign In"
              >
                Login
              </button>
            )}

            {/* PAIMANA Logo Insignia */}
            <div
              className="paimana-logo-insignia"
              onClick={() => handleNavClick('landing')}
              role="button"
              tabIndex={0}
              title="PAIMANA Portal"
            >
              <div className="paimana-logo-symbol">
                <span className="paimana-p-letter">P</span>
                <div className="paimana-logo-rings" aria-hidden="true">
                  <span className="ring ring-1"></span>
                  <span className="ring ring-2"></span>
                </div>
              </div>
              <div className="paimana-logo-typography">
                <span className="paimana-logo-hindi">पैमाना</span>
                <span className="paimana-logo-english">PAIMANA</span>
              </div>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              className="paimana-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* LAYER 3: Bright Sky Blue Navigation Band (~42px high) */}
      <nav className="paimana-nav-strip" aria-label="Main Navigation">
        <div className="paimana-nav-container">
          <ul className="paimana-nav-list" role="menubar">
            {/* Home */}
            <li className="paimana-nav-item" role="none">
              <button
                type="button"
                role="menuitem"
                className={`paimana-nav-link ${activeRoute === 'landing' ? 'active' : ''}`}
                onClick={() => handleNavClick('landing')}
              >
                Home
              </button>
            </li>

            {/* Publications Dropdown */}
            <li
              className={`paimana-nav-item has-dropdown ${activeDropdown === 'publications' ? 'open' : ''}`}
              ref={pubDropdownRef}
              role="none"
              onMouseEnter={() => setActiveDropdown('publications')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'publications'}
                className={`paimana-nav-link ${['project-monitoring', 'performance-monitoring', 'archive-project-monitoring', 'archive-project-performance', 'reports'].includes(activeRoute) ? 'active' : ''}`}
                onClick={() => toggleDropdown('publications')}
              >
                <span>Publications</span>
                <ChevronDown size={14} className="paimana-chevron" />
              </button>

              {activeDropdown === 'publications' && (
                <div className="paimana-dropdown-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('project-monitoring')}
                  >
                    <div className="paimana-dropdown-icon">
                      <FileText size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Project Monitoring</div>
                      <div className="paimana-dropdown-desc">Monthly Flash Reports & Sector Dossiers</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('performance-monitoring')}
                  >
                    <div className="paimana-dropdown-icon">
                      <BarChart3 size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Performance Monitoring</div>
                      <div className="paimana-dropdown-desc">Monthly Performance Review Reports</div>
                    </div>
                  </button>
                </div>
              )}
            </li>

            {/* Dashboard Dropdown */}
            <li
              className={`paimana-nav-item has-dropdown ${activeDropdown === 'dashboard' ? 'open' : ''}`}
              ref={dashDropdownRef}
              role="none"
              onMouseEnter={() => setActiveDropdown('dashboard')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'dashboard'}
                className={`paimana-nav-link ${['public-dashboard', 'dashboard', 'risk-monitor', 'map', 'analytics', 'simulator'].includes(activeRoute) ? 'active' : ''}`}
                onClick={() => toggleDropdown('dashboard')}
              >
                <span>Dashboard</span>
                <ChevronDown size={14} className="paimana-chevron" />
              </button>

              {activeDropdown === 'dashboard' && (
                <div className="paimana-dropdown-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('public-dashboard')}
                  >
                    <div className="paimana-dropdown-icon">
                      <Layers size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Public Dashboard</div>
                      <div className="paimana-dropdown-desc">National Infrastructure Overview</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('risk-monitor')}
                  >
                    <div className="paimana-dropdown-icon">
                      <Activity size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Risk Monitoring Center</div>
                      <div className="paimana-dropdown-desc">Early warning and slippage surveillance</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('map')}
                  >
                    <div className="paimana-dropdown-icon">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Geospatial Intelligence</div>
                      <div className="paimana-dropdown-desc">Interactive GIS Infrastructure Map</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('simulator')}
                  >
                    <div className="paimana-dropdown-icon">
                      <Sliders size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">What-If Scenario Simulator</div>
                      <div className="paimana-dropdown-desc">Policy intervention modeling</div>
                    </div>
                  </button>
                </div>
              )}
            </li>

            {/* About Us Dropdown */}
            <li
              className={`paimana-nav-item has-dropdown ${activeDropdown === 'about' ? 'open' : ''}`}
              ref={aboutDropdownRef}
              role="none"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'about'}
                className={`paimana-nav-link ${['about-ipmd', 'about-ocms', 'about-vision', 'orders-manuals'].includes(activeRoute) ? 'active' : ''}`}
                onClick={() => toggleDropdown('about')}
              >
                <span>About Us</span>
                <ChevronDown size={14} className="paimana-chevron" />
              </button>

              {activeDropdown === 'about' && (
                <div className="paimana-dropdown-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('about-ipmd')}
                  >
                    <div className="paimana-dropdown-icon">
                      <Layers size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">About IPMD</div>
                      <div className="paimana-dropdown-desc">Division Mandate & Institutional Role</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('about-ocms')}
                  >
                    <div className="paimana-dropdown-icon">
                      <Activity size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">About OCMS</div>
                      <div className="paimana-dropdown-desc">Online Computerized Monitoring System</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('about-vision')}
                  >
                    <div className="paimana-dropdown-icon">
                      <FileText size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Vision & Allocation</div>
                      <div className="paimana-dropdown-desc">Strategic Objectives & Government Business</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    className="paimana-dropdown-item"
                    onClick={() => handleNavClick('orders-manuals')}
                  >
                    <div className="paimana-dropdown-icon">
                      <FileText size={15} />
                    </div>
                    <div>
                      <div className="paimana-dropdown-title">Orders & Manuals</div>
                      <div className="paimana-dropdown-desc">Official Guidelines & CUF Documentation</div>
                    </div>
                  </button>
                </div>
              )}
            </li>

            {/* Projects Registry */}
            <li className="paimana-nav-item" role="none">
              <button
                type="button"
                role="menuitem"
                className={`paimana-nav-link ${activeRoute === 'projects' ? 'active' : ''}`}
                onClick={() => handleNavClick('projects')}
              >
                Projects
              </button>
            </li>

            {/* FAQ */}
            <li className="paimana-nav-item" role="none">
              <button
                type="button"
                role="menuitem"
                className={`paimana-nav-link ${activeRoute === 'faq' ? 'active' : ''}`}
                onClick={() => handleNavClick('faq')}
              >
                FAQ
              </button>
            </li>

            {/* Contact Us */}
            <li className="paimana-nav-item" role="none">
              <button
                type="button"
                role="menuitem"
                className={`paimana-nav-link ${activeRoute === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick('contact')}
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="paimana-mobile-drawer" role="dialog" aria-label="Mobile Navigation">
          <div className="paimana-mobile-drawer-header">
            <div className="paimana-mobile-brand">PAIMANA Menu</div>
            <button
              className="paimana-mobile-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation"
            >
              <X size={20} />
            </button>
          </div>

          <div className="paimana-mobile-drawer-body">
            <div className="paimana-mobile-actions">
              <button
                type="button"
                className="paimana-btn-orange-pill w-full"
                onClick={() => onOpenAddProject ? onOpenAddProject() : handleNavClick('login')}
              >
                Add Project / Update
              </button>
              <button
                type="button"
                className="paimana-btn-navy-pill w-full"
                onClick={() => handleNavClick('project-monitoring')}
              >
                <FileText size={15} /> Reports
              </button>
            </div>

            <nav className="paimana-mobile-links">
              <button className="paimana-mob-link" onClick={() => handleNavClick('landing')}>
                Home
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('public-dashboard')}>
                Public Dashboard
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('project-monitoring')}>
                Project Monitoring Reports
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('performance-monitoring')}>
                Performance Monitoring Reports
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('projects')}>
                Projects Inventory
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('about-ipmd')}>
                About IPMD
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('orders-manuals')}>
                Orders & Manuals
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('risk-monitor')}>
                Risk Monitor Center
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('map')}>
                Geospatial India Map
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('faq')}>
                FAQ
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('contact')}>
                Contact Us
              </button>
              <button className="paimana-mob-link" onClick={() => handleNavClick('login')}>
                {user.isLoggedIn ? `Logged in: ${user.name}` : 'Official Sign In'}
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
