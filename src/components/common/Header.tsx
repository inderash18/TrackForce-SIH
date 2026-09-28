import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  Home
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRoute,
    selectedProjectId,
    selectedProject,
    reportingMonth,
    globalSearch,
    setGlobalSearch,
    alerts,
    user,
    logoutUser,
    navigateTo,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowSearchModal(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeAlertsCount = alerts.filter(
    (a) => a.severity === 'critical' || a.status === 'active' || a.status === 'Active'
  ).length;

  const getBreadcrumbs = () => {
    switch (activeRoute) {
      case 'dashboard':
        return { title: 'Overview', breadcrumb: 'PAIMANA / Overview' };
      case 'projects':
        return { title: 'Projects', breadcrumb: 'PAIMANA / Projects' };
      case 'project-detail':
        return {
          title: selectedProject ? selectedProject.name : 'Project Details',
          breadcrumb: `Projects / ${selectedProjectId}`
        };
      case 'risk-monitor':
        return { title: 'Risks & Actions', breadcrumb: 'PAIMANA / Risks' };
      case 'alerts':
        return { title: 'Risks & Actions', breadcrumb: 'PAIMANA / Risks & Actions' };
      case 'analytics':
        return { title: 'Portfolio Analytics', breadcrumb: 'Intelligence / Analytics' };
      case 'benchmarking':
        return { title: 'Benchmarking', breadcrumb: 'Intelligence / Benchmarking' };
      case 'map':
        return { title: 'Project Map', breadcrumb: 'Surveillance / Map' };
      case 'simulator':
        return { title: 'What-If Simulator', breadcrumb: 'Tools / Simulator' };
      case 'assistant':
        return { title: 'AI Assistant', breadcrumb: 'Tools / AI Assistant' };
      case 'reports':
        return { title: 'Reports', breadcrumb: 'PAIMANA / Reports' };
      case 'data':
        return { title: 'Data Management', breadcrumb: 'PAIMANA / Data' };
      case 'model-performance':
        return { title: 'Model Performance', breadcrumb: 'Tools / ML Models' };
      case 'admin':
        return { title: 'Settings & Access', breadcrumb: 'PAIMANA / Settings' };
      case 'landing':
        return { title: 'Public Portal', breadcrumb: 'PAIMANA / Portal' };
      case 'login':
        return { title: 'Sign In', breadcrumb: 'Auth / Sign In' };
      default:
        return { title: 'Overview', breadcrumb: 'PAIMANA / Overview' };
    }
  };

  const { title, breadcrumb } = getBreadcrumbs();

  return (
    <>
      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--color-surface-nav)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Left Section: Breadcrumb & Dynamic Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>

          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              {breadcrumb}
            </div>
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
                margin: 0,
                lineHeight: 1.2
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {/* Center / Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => setShowSearchModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-surface-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              cursor: 'pointer',
              minWidth: '220px',
              transition: 'all 150ms ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <Search size={14} color="var(--color-text-muted)" />
            <span style={{ fontSize: '12px', color: globalSearch ? 'var(--color-text-primary)' : 'var(--color-text-dim)', flex: 1 }}>
              {globalSearch || 'Search projects, sectors...'}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                backgroundColor: 'var(--color-surface-elevated)',
                color: 'var(--color-text-muted)',
                padding: '2px 5px',
                borderRadius: '4px',
                border: '1px solid var(--color-border)'
              }}
            >
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {/* Public Portal Button */}
          <button
            type="button"
            onClick={() => navigateTo('landing')}
            className="btn-secondary"
            style={{ fontSize: '11.5px', padding: '5px 10px', height: '32px' }}
            title="Go to Public PAIMANA Portal"
          >
            <Home size={13} color="var(--color-action-primary)" />
            <span>Public Portal</span>
          </button>

          {/* Reporting Period Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'var(--color-surface-panel)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11.5px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500
            }}
          >
            <Calendar size={13} color="var(--color-action-primary)" />
            <span>{reportingMonth}</span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: showNotifications ? 'var(--color-surface-hover)' : 'var(--color-surface-panel)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Early Warning Notifications"
          >
            <Bell size={16} />
            {activeAlertsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-critical)',
                  color: '#FFFFFF',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--color-surface-nav)'
                }}
              >
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: '48px',
                width: '360px',
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-elevated)',
                zIndex: 200,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Early Warnings ({alerts.length})
                </div>
                <button
                  onClick={() => {
                    navigateTo('alerts');
                    setShowNotifications(false);
                  }}
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-action-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  View All Signals
                </button>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {alerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      navigateTo('alerts');
                      setShowNotifications(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'background 120ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: alert.severity === 'critical' ? 'var(--status-critical-text)' : 'var(--status-high-text)',
                          textTransform: 'uppercase'
                        }}
                      >
                        {alert.warningType || alert.severity}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>
                        {alert.timestamp || 'Fresh Signal'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '3px' }}>
                      {alert.projectName}
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.3 }}>
                      {alert.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Profile Button & Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                background: showUserMenu ? 'var(--color-surface-hover)' : 'var(--color-surface-panel)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--color-text-primary)'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-action-subtle)',
                  color: 'var(--color-action-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </button>

            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '240px',
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-elevated)',
                  zIndex: 200,
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {user.email}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-accent-cyan)', marginTop: '2px', fontWeight: 500 }}>
                    {user.role} · {user.badge}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigateTo('admin');
                    setShowUserMenu(false);
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '12px', padding: '6px 8px' }}
                >
                  <ShieldCheck size={14} /> System Access & Roles
                </button>

                <button
                  onClick={() => {
                    logoutUser();
                    setShowUserMenu(false);
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '12px', color: 'var(--status-critical-text)', padding: '6px 8px' }}
                >
                  <LogOut size={14} /> End Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal (Ctrl+K) */}
      {showSearchModal && (
        <div
          className="drawer-backdrop"
          onClick={() => setShowSearchModal(false)}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '100px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '580px',
              maxWidth: '92vw',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-elevated)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Search size={18} color="var(--color-action-primary)" />
              <input
                autoFocus
                type="text"
                placeholder="Search projects, corridors, ministries, or risk signals..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)'
                }}
              />
              <button
                onClick={() => setShowSearchModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '12px 16px', maxHeight: '320px', overflowY: 'auto' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                QUICK NAVIGATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { route: 'dashboard', label: 'National Overview Dashboard' },
                  { route: 'projects', label: 'Central Projects Explorer' },
                  { route: 'alerts', label: 'Active Early Warning Signals' },
                  { route: 'simulator', label: 'What-If Policy & Intervention Simulator' },
                  { route: 'map', label: 'India Geospatial Intelligence Map' }
                ].map((item) => (
                  <button
                    key={item.route}
                    onClick={() => {
                      navigateTo(item.route as any);
                      setShowSearchModal(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'var(--color-surface-panel)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      textAlign: 'left'
                    }}
                  >
                    <span>{item.label}</span>
                    <ExternalLink size={13} color="var(--color-text-muted)" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
