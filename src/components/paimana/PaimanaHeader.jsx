import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, PlusCircle, LogIn, UserCheck } from 'lucide-react';
export const PaimanaHeader = ({ activeRoute: explicitActiveRoute, onNavigate, onOpenAddProject, onOpenLoginModal }) => {
    const { navigateTo, user, activeRoute: contextActiveRoute } = useApp();
    const activeRoute = explicitActiveRoute || contextActiveRoute;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleNavClick = (route) => {
        if (onNavigate) {
            onNavigate(route);
        }
        else {
            navigateTo(route);
        }
        setMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (<header className="paimana-header-unified" role="banner">
      {/* Main Glass Navbar */}
      <div className="paimana-navbar-main">
        <div className="paimana-navbar-inner">
          {/* Brand Logo & Emblem */}
          <div className="paimana-nav-brand" onClick={() => handleNavClick('landing')} role="button" tabIndex={0} aria-label="PAIMANA Home">
            <div className="paimana-nav-emblem" aria-hidden="true">
              <svg width="32" height="38" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 2C21.5 2 19.5 3.8 19.5 6C19.5 7.4 20.2 8.6 21.3 9.3C18 10.5 15 13.5 15 17.5C15 20.2 16.5 22.5 18.8 23.8C17 25 15.5 27 15.5 29.5C15.5 33 18.5 36 22 36.5V40H14C12.9 40 12 40.9 12 42V45H36V42C36 40.9 35.1 40 34 40H26V36.5C29.5 36 32.5 33 32.5 29.5C32.5 27 31 25 29.2 23.8C31.5 22.5 33 20.2 33 17.5C33 13.5 30 10.5 26.7 9.3C27.8 8.6 28.5 7.4 28.5 6C28.5 3.8 26.5 2 24 2Z" fill="#B45309"/>
                <path d="M10 47H38V51C38 52.1 37.1 53 36 53H12C10.9 53 10 52.1 10 51V47Z" fill="#0F172A"/>
                <circle cx="24" cy="49" r="2.5" fill="#D97706"/>
                <path d="M21 54H27V55H21V54Z" fill="#B45309"/>
              </svg>
            </div>

            <div className="paimana-nav-titlegroup">
              <div className="paimana-brand-row">
                <span className="paimana-brand-name">PAIMANA</span>
                <span className="paimana-brand-badge">Sentinel AI</span>
              </div>
              <span className="paimana-brand-sub">MoSPI · IPMD National Monitoring</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="paimana-nav-center" aria-label="Main Navigation">
            <button type="button" className={`paimana-nav-item ${activeRoute === 'landing' || activeRoute === 'public-dashboard' ? 'active' : ''}`} onClick={() => handleNavClick('landing')}>
              Overview
            </button>

            <button type="button" className={`paimana-nav-item ${activeRoute === 'projects' || activeRoute === 'project-detail' ? 'active' : ''}`} onClick={() => handleNavClick('projects')}>
              Projects
            </button>

            <button type="button" className={`paimana-nav-item ${activeRoute === 'project-monitoring' || activeRoute === 'performance-monitoring' || activeRoute === 'reports' ? 'active' : ''}`} onClick={() => handleNavClick('project-monitoring')}>
              Reports
            </button>

            <button type="button" className={`paimana-nav-item ${activeRoute === 'orders-manuals' ? 'active' : ''}`} onClick={() => handleNavClick('orders-manuals')}>
              Orders & CUF
            </button>

            <button type="button" className={`paimana-nav-item ${activeRoute === 'about-ipmd' || activeRoute === 'about-ocms' || activeRoute === 'about-vision' ? 'active' : ''}`} onClick={() => handleNavClick('about-ipmd')}>
              About
            </button>

            <button type="button" className={`paimana-nav-item ${activeRoute === 'faq' ? 'active' : ''}`} onClick={() => handleNavClick('faq')}>
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="paimana-nav-actions">
            {/* Add Project Pill */}
            <button type="button" className="paimana-action-pill orange-glow" onClick={() => onOpenAddProject ? onOpenAddProject() : handleNavClick('data')} title="Add New Project or Upload CUF Return">
              <PlusCircle size={14}/>
              <span>Add Project</span>
            </button>

            {/* Login / Workspace Button */}
            {user.isLoggedIn ? (<button type="button" className="paimana-action-pill charcoal-pill" onClick={() => handleNavClick('dashboard')} title={`Open Workspace (${user.name})`}>
                <UserCheck size={14} className="text-emerald-400"/>
                <span>Workspace</span>
              </button>) : (<button type="button" className="paimana-action-pill charcoal-pill" onClick={() => onOpenLoginModal ? onOpenLoginModal() : handleNavClick('login')} title="Official Portal Sign In">
                <LogIn size={14}/>
                <span>Sign In</span>
              </button>)}

            {/* Mobile Hamburger Menu Toggle */}
            <button type="button" className="paimana-hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
              {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (<div className="paimana-mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="paimana-mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-mobile-header">
              <div className="paimana-mobile-brand">
                <span className="font-bold text-slate-900">PAIMANA</span>
                <span className="text-xs text-sky-600 ml-2">MoSPI IPMD</span>
              </div>
              <button type="button" className="paimana-mobile-close" onClick={() => setMobileMenuOpen(false)}>
                <X size={18}/>
              </button>
            </div>

            <div className="paimana-mobile-actions-stack">
              <button type="button" className="paimana-action-pill orange-glow w-full justify-center" onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddProject ? onOpenAddProject() : handleNavClick('data');
            }}>
                <PlusCircle size={15}/>
                <span>Add Project / CUF Update</span>
              </button>
              <button type="button" className="paimana-action-pill charcoal-pill w-full justify-center" onClick={() => {
                setMobileMenuOpen(false);
                user.isLoggedIn ? handleNavClick('dashboard') : (onOpenLoginModal ? onOpenLoginModal() : handleNavClick('login'));
            }}>
                {user.isLoggedIn ? <UserCheck size={15}/> : <LogIn size={15}/>}
                <span>{user.isLoggedIn ? 'Go to Workspace' : 'Official Sign In'}</span>
              </button>
            </div>

            <nav className="paimana-mobile-nav-list">
              <button className="mobile-nav-link" onClick={() => handleNavClick('landing')}>
                Overview & Portal
              </button>
              <button className="mobile-nav-link" onClick={() => handleNavClick('projects')}>
                Projects Directory
              </button>
              <button className="mobile-nav-link" onClick={() => handleNavClick('project-monitoring')}>
                Monthly Monitoring Reports
              </button>
              <button className="mobile-nav-link" onClick={() => handleNavClick('orders-manuals')}>
                Official Orders & CUF Manuals
              </button>
              <button className="mobile-nav-link" onClick={() => handleNavClick('about-ipmd')}>
                About IPMD & Mandate
              </button>
              <button className="mobile-nav-link" onClick={() => handleNavClick('faq')}>
                Frequently Asked Questions
              </button>
              <button className="mobile-nav-link" onClick={() => handleNavClick('contact')}>
                Contact IPMD MoSPI
              </button>
            </nav>
          </div>
        </div>)}
    </header>);
};
