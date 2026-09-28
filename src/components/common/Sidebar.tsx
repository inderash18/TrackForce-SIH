import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ActiveNavRoute } from '../../types/project';
import {
  LayoutDashboard,
  FolderGit2,
  ShieldAlert,
  FileText,
  Database,
  Sliders,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeRoute, navigateTo, sidebarCollapsed, setSidebarCollapsed, alerts } = useApp();

  const criticalAlertsCount = alerts.filter(
    (a) => a.severity === 'critical' && (a.status === 'active' || a.status === 'Active')
  ).length;

  const primaryNavItems: {
    id: ActiveNavRoute;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
    {
      id: 'alerts',
      label: 'Risks & Actions',
      icon: <ShieldAlert size={18} />,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : undefined,
      badgeColor: '#EF4444'
    },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} /> },
    { id: 'data', label: 'Data', icon: <Database size={18} /> }
  ];

  const secondaryNavItems: {
    id: ActiveNavRoute;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    { id: 'simulator', label: 'What-If Simulator', icon: <Sliders size={16} />, badge: 'Sim' },
    { id: 'assistant', label: 'AI Assistant', icon: <Sparkles size={16} />, badge: 'Qwen' },
    { id: 'admin', label: 'Settings & Access', icon: <Settings size={16} /> }
  ];

  return (
    <aside
      style={{
        width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--color-surface-nav)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 180ms ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 110,
        borderRight: '1px solid var(--color-border)',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: sidebarCollapsed ? '16px 8px' : '18px 16px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          cursor: 'pointer',
          background: 'var(--color-bg-app)'
        }}
        onClick={() => navigateTo('dashboard')}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-action-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '15px',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
            flexShrink: 0
          }}
        >
          P
        </div>

        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div
              style={{
                fontSize: '14.5px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              PAIMANA{' '}
              <span
                style={{
                  fontSize: '10.5px',
                  background: 'var(--color-action-subtle)',
                  color: 'var(--color-accent-cyan)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}
              >
                AI
              </span>
            </div>
            <div
              style={{
                fontSize: '10.5px',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}
            >
              MoSPI IPMD
            </div>
          </div>
        )}
      </div>

      {/* Primary Navigation Items */}
      <div
        style={{
          flex: 1,
          padding: sidebarCollapsed ? '14px 6px' : '16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {!sidebarCollapsed && (
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--color-text-dim)',
              letterSpacing: '0.08em',
              padding: '0 10px 8px',
              textTransform: 'uppercase'
            }}
          >
            Navigation
          </div>
        )}

        {primaryNavItems.map((item) => {
          const isActive =
            activeRoute === item.id ||
            (item.id === 'projects' && activeRoute === 'project-detail') ||
            (item.id === 'alerts' && activeRoute === 'risk-monitor');

          return (
            <button
              key={item.id}
              type="button"
              title={sidebarCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarCollapsed ? '10px 0' : '9px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                backgroundColor: isActive ? '#E0F2FE' : 'transparent',
                color: isActive ? '#0284C7' : '#334155',
                border: 'none',
                borderLeft: isActive ? '3px solid #0284C7' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                width: '100%',
                textAlign: 'left',
                transition: 'all 120ms ease'
              }}
              onClick={() => navigateTo(item.id)}
            >
              <span
                style={{
                  color: isActive ? '#0284C7' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0
                }}
              >
                {item.icon}
              </span>

              {!sidebarCollapsed && (
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span
                  style={{
                    backgroundColor: item.badgeColor || '#0284C7',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    lineHeight: '1.2'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Secondary / Tools Section */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
          {!sidebarCollapsed && (
            <div
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--color-text-dim)',
                letterSpacing: '0.08em',
                padding: '0 10px 8px',
                textTransform: 'uppercase'
              }}
            >
              Decision Tools
            </div>
          )}

          {secondaryNavItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={sidebarCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: sidebarCollapsed ? '8px 0' : '7px 12px',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#E0F2FE' : 'transparent',
                  color: isActive ? '#0284C7' : '#64748B',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 600 : 500,
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 120ms ease'
                }}
                onClick={() => navigateTo(item.id)}
              >
                <span style={{ color: isActive ? '#0284C7' : '#94A3B8', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>

                {!sidebarCollapsed && (
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span
                    style={{
                      backgroundColor: 'var(--color-surface-hover)',
                      color: 'var(--color-text-muted)',
                      fontSize: '9.5px',
                      fontWeight: 600,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Info & Portal Link at Bottom */}
      <div
        style={{
          padding: sidebarCollapsed ? '12px 6px' : '14px 12px',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-elevated)'
        }}
      >
        <button
          type="button"
          onClick={() => navigateTo('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '6px 8px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            fontSize: '11.5px',
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
          }}
          title="Back to Public Portal"
        >
          <ExternalLink size={14} />
          {!sidebarCollapsed && <span>Public Portal</span>}
        </button>

        {/* Sidebar Collapse Toggle Button */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '6px 8px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            fontSize: '11.5px',
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            marginTop: '4px'
          }}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!sidebarCollapsed && <span>Collapse menu</span>}
        </button>
      </div>
    </aside>
  );
};
