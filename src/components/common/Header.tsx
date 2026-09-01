import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Calendar,
  Filter,
  Building2,
  ChevronDown,
  ShieldCheck,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { ministrySummaryList, sectorSummaryList } from '../../data/nationalMetrics';

export const Header: React.FC = () => {
  const {
    activeRoute,
    selectedProjectId,
    selectedProject,
    reportingMonth,
    setReportingMonth,
    selectedMinistry,
    setSelectedMinistry,
    selectedSector,
    setSelectedSector,
    globalSearch,
    setGlobalSearch,
    alerts,
    user,
    logoutUser,
    navigateTo
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.status === 'active' || a.severity === 'critical').length;

  // Derive human-readable page title and breadcrumb
  const getBreadcrumbs = () => {
    switch (activeRoute) {
      case 'dashboard':
        return { title: 'National Infrastructure Intelligence', breadcrumb: 'Dashboard / National Overview' };
      case 'projects':
        return { title: 'Central Sector Projects Inventory', breadcrumb: 'Projects / Registry & Filter' };
      case 'project-detail':
        return {
          title: selectedProject ? selectedProject.name : 'Project Intelligence Dossier',
          breadcrumb: `Projects / ${selectedProjectId}`
        };
      case 'risk-monitor':
        return { title: 'National Risk Monitoring Center', breadcrumb: 'Surveillance / Portfolio Risk Monitor' };
      case 'alerts':
        return { title: 'Early Warning Intelligence Signals', breadcrumb: 'Early Warnings / Active Alerts' };
      case 'analytics':
        return { title: 'Infrastructure Portfolio Analytics', breadcrumb: 'Intelligence / Multi-Dimensional Analytics' };
      case 'benchmarking':
        return { title: 'Project Peer Benchmarking Lab', breadcrumb: 'Decision Support / Benchmarking' };
      case 'map':
        return { title: 'Geospatial Infrastructure Intelligence', breadcrumb: 'Surveillance / India Risk Map' };
      case 'simulator':
        return { title: 'What-If Policy & Intervention Simulator', breadcrumb: 'Decision Support / What-If Simulator' };
      case 'assistant':
        return { title: 'Sentinel AI Intelligence Assistant', breadcrumb: 'AI Assistant / Copilot' };
      case 'reports':
        return { title: 'Executive Dossiers & Statutory Reports', breadcrumb: 'Reports / Cabinet & Ministry Briefs' };
      case 'data':
        return { title: 'Data Management & Confidence Audit', breadcrumb: 'Data Pipeline / CUF & OCMS Sources' };
      case 'model-performance':
        return { title: 'Predictive ML Model Validation & Metrics', breadcrumb: 'AI Architecture / Model Performance' };
      case 'admin':
        return { title: 'System Administration & RBAC', breadcrumb: 'System / Governance & Access Control' };
      case 'landing':
        return { title: 'PAIMANA Sentinel AI Platform', breadcrumb: 'Public / Overview' };
      case 'login':
        return { title: 'Secure Official Login', breadcrumb: 'Auth / Sign In' };
      default:
        return { title: 'PAIMANA Sentinel AI', breadcrumb: 'System / Overview' };
    }
  };

  const { title, breadcrumb } = getBreadcrumbs();

  return (
    <header
      style={{
        height: '72px',
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border-grey)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 2px rgba(16, 24, 40, 0.03)'
      }}
    >
      {/* Left: Breadcrumb & Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '380px' }}>
        <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
          {breadcrumb}
        </span>
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-text-dark)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0
          }}
          title={title}
        >
          {title}
        </h1>
      </div>

      {/* Center/Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Global Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            size={14}
            color="var(--color-text-secondary)"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="gov-input"
            placeholder="Search project, code, state..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            style={{ paddingLeft: '32px', width: '100%', fontSize: '12.5px' }}
          />
        </div>

        {/* Reporting Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-soft)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)' }}>
          <Calendar size={13} color="var(--color-text-secondary)" />
          <select
            className="gov-select"
            value={reportingMonth}
            onChange={e => setReportingMonth(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '2px 4px', fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-dark)', cursor: 'pointer' }}
          >
            <option value="April 2026">April 2026 (Live)</option>
            <option value="March 2026">March 2026</option>
            <option value="February 2026">February 2026</option>
            <option value="January 2026">January 2026</option>
            <option value="December 2025">December 2025</option>
          </select>
        </div>

        {/* Ministry Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-soft)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)' }}>
          <Building2 size={13} color="var(--color-text-secondary)" />
          <select
            className="gov-select"
            value={selectedMinistry}
            onChange={e => setSelectedMinistry(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '2px 4px', fontSize: '12.5px', color: 'var(--color-text-dark)', maxWidth: '140px', cursor: 'pointer' }}
          >
            <option value="All Ministries">All Ministries</option>
            {ministrySummaryList.map(m => (
              <option key={m.ministry} value={m.ministry}>
                {m.ministry.split('(')[0].trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-bg-soft)', padding: '4px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)' }}>
          <Filter size={13} color="var(--color-text-secondary)" />
          <select
            className="gov-select"
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            style={{ border: 'none', background: 'transparent', padding: '2px 4px', fontSize: '12.5px', color: 'var(--color-text-dark)', maxWidth: '130px', cursor: 'pointer' }}
          >
            <option value="All Sectors">All Sectors</option>
            {sectorSummaryList.map(s => (
              <option key={s.sector} value={s.sector}>
                {s.sector}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '7px 10px', position: 'relative' }}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Early Warning Notifications"
          >
            <Bell size={15} color="var(--color-text-dark)" />
            {activeAlertsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--status-critical-dot)',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  minWidth: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px'
                }}
              >
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div
              className="gov-card"
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '360px',
                zIndex: 200,
                boxShadow: 'var(--shadow-lg)',
                padding: 0
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-grey)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-text-dark)' }}>
                  Active Early Warnings ({activeAlertsCount})
                </span>
                <button
                  className="btn btn-sm"
                  style={{ color: 'var(--color-royal-blue)', background: 'transparent', padding: '2px 6px' }}
                  onClick={() => {
                    setShowNotifications(false);
                    navigateTo('alerts');
                  }}
                >
                  View All
                </button>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {alerts.slice(0, 4).map(alert => (
                  <div
                    key={alert.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--color-border-light)',
                      cursor: 'pointer',
                      transition: 'background-color 100ms'
                    }}
                    onClick={() => {
                      setShowNotifications(false);
                      navigateTo('alerts');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <AlertTriangle size={12} color={alert.severity === 'critical' ? 'var(--status-critical-dot)' : 'var(--status-high-dot)'} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                        {alert.projectName.slice(0, 32)}...
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.3 }}>
                      {alert.warningTitle}
                    </p>
                    <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                      {alert.timestamp} • {alert.responsibleAgency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              border: '1px solid var(--color-border-grey)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-white)',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-deep-navy)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              RV
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)', lineHeight: 1.2 }}>
                {user.name.split(',')[0]}
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', lineHeight: 1.2 }}>
                {user.role}
              </span>
            </div>
            <ChevronDown size={13} color="var(--color-text-secondary)" />
          </div>

          {/* User Menu */}
          {showUserMenu && (
            <div
              className="gov-card"
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '220px',
                zIndex: 200,
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 0'
              }}
            >
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border-grey)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Department</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)' }}>{user.department}</span>
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: 'var(--color-text-dark)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onClick={() => {
                  setShowUserMenu(false);
                  navigateTo('admin');
                }}
              >
                <ShieldCheck size={14} color="var(--color-royal-blue)" />
                RBAC & User Access
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: 'var(--status-critical-text)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onClick={() => {
                  setShowUserMenu(false);
                  logoutUser();
                }}
              >
                <LogOut size={14} color="var(--status-critical-dot)" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
