import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ActiveNavRoute } from '../../types/project';
import {
  LayoutDashboard,
  FolderGit2,
  ShieldAlert,
  BellRing,
  BarChart3,
  GitCompare,
  Map,
  Sliders,
  Sparkles,
  FileText,
  Database,
  Cpu,
  Shield,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface NavItem {
  id: ActiveNavRoute;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeRoute, navigateTo, sidebarCollapsed, setSidebarCollapsed, alerts } = useApp();

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
    { id: 'risk-monitor', label: 'Risk Monitor', icon: <ShieldAlert size={18} /> },
    {
      id: 'alerts',
      label: 'Early Warnings',
      icon: <BellRing size={18} />,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : undefined,
      badgeColor: 'var(--status-critical-dot)'
    },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'benchmarking', label: 'Benchmarking', icon: <GitCompare size={18} /> },
    { id: 'map', label: 'Map Intelligence', icon: <Map size={18} /> },
    { id: 'simulator', label: 'What-If Simulator', icon: <Sliders size={18} /> },
    { id: 'assistant', label: 'AI Assistant', icon: <Sparkles size={18} />, badge: 'AI', badgeColor: 'var(--color-royal-blue)' },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'data', label: 'Data Management', icon: <Database size={18} /> },
    { id: 'model-performance', label: 'Model Performance', icon: <Cpu size={18} /> },
    { id: 'admin', label: 'Administration', icon: <Shield size={18} /> }
  ];

  return (
    <aside
      style={{
        width: sidebarCollapsed ? '76px' : '260px',
        backgroundColor: 'var(--color-deep-navy)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 110,
        borderRight: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: sidebarCollapsed ? '20px 12px' : '20px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          cursor: 'pointer'
        }}
        onClick={() => navigateTo('dashboard')}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-royal-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px',
            color: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(30, 94, 255, 0.4)',
            flexShrink: 0
          }}
        >
          PS
        </div>

        {!sidebarCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span
              style={{
                fontSize: '14.5px',
                fontWeight: 700,
                letterSpacing: '0.01em',
                color: '#FFFFFF',
                whiteSpace: 'nowrap'
              }}
            >
              PAIMANA Sentinel
            </span>
            <span
              style={{
                fontSize: '10.5px',
                color: '#94A3B8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              MoSPI Infrastructure AI
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div
        style={{
          flex: 1,
          padding: '16px 10px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}
      >
        {mainNavItems.map(item => {
          const isActive =
            activeRoute === item.id || (item.id === 'projects' && activeRoute === 'project-detail');

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: sidebarCollapsed ? '10px 0' : '9px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(30, 94, 255, 0.22)' : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                position: 'relative',
                textAlign: 'left'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              {/* Active Bar Indicator */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    bottom: '6px',
                    width: '3.5px',
                    backgroundColor: 'var(--color-royal-blue)',
                    borderRadius: '0 3px 3px 0'
                  }}
                />
              )}

              <div
                style={{
                  color: isActive ? 'var(--color-royal-blue)' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {item.icon}
              </div>

              {!sidebarCollapsed && (
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span
                  style={{
                    backgroundColor: item.badgeColor || 'var(--color-royal-blue)',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    marginLeft: 'auto'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer & Collapse Toggle */}
      <div
        style={{
          padding: '12px 10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <button
          onClick={() => navigateTo('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: sidebarCollapsed ? '8px 0' : '8px 12px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderRadius: '6px',
            border: 'none',
            background: 'none',
            color: '#94A3B8',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          <HelpCircle size={16} />
          {!sidebarCollapsed && <span>Platform Overview</span>}
        </button>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: sidebarCollapsed ? '8px 0' : '8px 12px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            color: '#CBD5E1',
            fontSize: '11.5px',
            cursor: 'pointer',
            marginTop: '4px'
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!sidebarCollapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
