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
  ChevronRight
} from 'lucide-react';

interface NavGroup {
  groupTitle: string;
  items: {
    id: ActiveNavRoute;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeRoute, navigateTo, sidebarCollapsed, setSidebarCollapsed, alerts, user } = useApp();

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' && (a.status === 'active' || a.status === 'Active')).length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'MONITORING',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
        { id: 'projects', label: 'Projects Registry', icon: <FolderGit2 size={17} /> },
        { id: 'risk-monitor', label: 'Risk Monitor', icon: <ShieldAlert size={17} /> },
        {
          id: 'alerts',
          label: 'Early Warnings',
          icon: <BellRing size={17} />,
          badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : undefined,
          badgeColor: 'var(--status-critical)'
        }
      ]
    },
    {
      groupTitle: 'INTELLIGENCE',
      items: [
        { id: 'analytics', label: 'Portfolio Analytics', icon: <BarChart3 size={17} /> },
        { id: 'benchmarking', label: 'Benchmarking', icon: <GitCompare size={17} /> },
        { id: 'map', label: 'Map Intelligence', icon: <Map size={17} /> }
      ]
    },
    {
      groupTitle: 'AI DECISION SUPPORT',
      items: [
        { id: 'simulator', label: 'What-If Simulator', icon: <Sliders size={17} />, badge: 'Sim', badgeColor: 'var(--status-prediction)' },
        { id: 'assistant', label: 'AI Assistant', icon: <Sparkles size={17} />, badge: 'Qwen', badgeColor: 'var(--color-action-primary)' },
        { id: 'model-performance', label: 'Model Performance', icon: <Cpu size={17} /> }
      ]
    },
    {
      groupTitle: 'SYSTEM & DATA',
      items: [
        { id: 'reports', label: 'Executive Reports', icon: <FileText size={17} /> },
        { id: 'data', label: 'Data Management', icon: <Database size={17} /> },
        { id: 'admin', label: 'Administration & RBAC', icon: <Shield size={17} /> }
      ]
    }
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
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              PAIMANA <span style={{ fontSize: '10.5px', background: 'var(--color-action-subtle)', color: 'var(--color-accent-cyan)', border: '1px solid var(--color-border-subtle)', padding: '1px 5px', borderRadius: '4px' }}>AI</span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
              MoSPI SENTINEL CORE
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, padding: sidebarCollapsed ? '12px 6px' : '14px 10px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {navGroups.map((group) => (
          <div key={group.groupTitle}>
            {!sidebarCollapsed && (
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--color-text-dim)',
                  letterSpacing: '0.08em',
                  padding: '4px 10px 6px',
                  textTransform: 'uppercase'
                }}
              >
                {group.groupTitle}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map((item) => {
                const isActive = activeRoute === item.id;
                return (
                  <button
                    key={item.id}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: sidebarCollapsed ? '9px 0' : '8px 12px',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#E0F2FE' : 'transparent',
                      color: isActive ? '#0084C7' : '#334155',
                      border: 'none',
                      borderLeft: isActive ? '3px solid #0084C7' : '3px solid transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 120ms ease',
                      width: '100%',
                      textAlign: 'left',
                      position: 'relative'
                    }}
                    onClick={() => navigateTo(item.id)}
                  >
                    <span style={{ color: isActive ? '#0084C7' : '#64748B', display: 'flex' }}>
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
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                          backgroundColor: item.badgeColor || '#0084C7',
                          color: '#FFFFFF'
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
        ))}
      </div>

      {/* Footer Profile & Collapse Toggle */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 10px', background: 'var(--color-bg-app)' }}>
        {!sidebarCollapsed && (
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-panel)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-action-subtle)',
                color: 'var(--color-action-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid var(--color-action-border)'
              }}
            >
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.name || 'Official User'}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.role || 'Super Admin'}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            width: '100%',
            padding: '7px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 500,
            transition: 'all 120ms ease'
          }}
          title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /> <span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};
