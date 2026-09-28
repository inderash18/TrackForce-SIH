import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, FolderGit2, ShieldAlert, FileText, Database, Sliders, Sparkles, Settings, ChevronLeft, ChevronRight, UserCheck, ExternalLink } from 'lucide-react';
export const Sidebar = () => {
    const { activeRoute, navigateTo, sidebarCollapsed, setSidebarCollapsed, scopedAlerts, user } = useApp();
    const criticalAlertsCount = (scopedAlerts || []).filter((a) => a.severity.toLowerCase() === 'critical' && (a.status || '').toLowerCase() !== 'resolved').length;
    const primaryNavItems = [
        {
            id: 'dashboard',
            label: 'Overview',
            icon: (isActive) => (<LayoutDashboard size={17} color={isActive ? '#38BDF8' : '#475569'}/>)
        },
        {
            id: 'projects',
            label: 'Projects',
            icon: (isActive) => (<FolderGit2 size={17} color={isActive ? '#38BDF8' : '#475569'}/>)
        },
        {
            id: 'alerts',
            label: 'Risks & Actions',
            icon: (isActive) => (<ShieldAlert size={17} color={isActive ? '#F59E0B' : '#475569'}/>),
            badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : undefined
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: (isActive) => (<FileText size={17} color={isActive ? '#38BDF8' : '#475569'}/>)
        },
        {
            id: 'data',
            label: 'Data',
            icon: (isActive) => (<Database size={17} color={isActive ? '#38BDF8' : '#475569'}/>)
        }
    ];
    const toolsNavItems = [
        {
            id: 'simulator',
            label: 'What-If Simulator',
            icon: (isActive) => (<Sliders size={16} color={isActive ? '#38BDF8' : '#64748B'}/>),
            badge: 'Sim'
        },
        {
            id: 'assistant',
            label: 'AI Assistant',
            icon: (isActive) => (<Sparkles size={16} color={isActive ? '#38BDF8' : '#64748B'}/>),
            badge: 'Qwen'
        }
    ];
    return (<aside className={`floating-sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'}`} style={{
            width: sidebarCollapsed ? '68px' : '236px',
            margin: '12px 0 12px 14px',
            height: 'calc(100vh - 24px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '22px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 24px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: sidebarCollapsed ? '18px 8px 14px' : '18px 12px 14px',
            transition: 'width 220ms cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
            position: 'sticky',
            top: '12px',
            zIndex: 110,
            overflow: 'hidden',
            userSelect: 'none'
        }}>
      {/* Top Section: Brand Emblem & Header */}
      <div>
        <div onClick={() => navigateTo('dashboard')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            padding: sidebarCollapsed ? '4px 0 14px' : '4px 6px 14px',
            borderBottom: '1px solid #F1F5F9',
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
        }} title="PAIMANA Sentinel AI">
          {/* PAIMANA Sentinel National Tech Emblem */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
            flexShrink: 0
        }}>
            <span style={{
            color: '#FFFFFF',
            fontWeight: 900,
            fontSize: '17px',
            letterSpacing: '-0.5px'
        }}>
              P
            </span>
          </div>

          {!sidebarCollapsed && (<div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{
                fontSize: '14.5px',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}>
                PAIMANA
                <span style={{
                fontSize: '9.5px',
                fontWeight: 700,
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                padding: '1px 5px',
                borderRadius: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
            }}>
                  AI
                </span>
              </div>
              <div style={{
                fontSize: '10px',
                color: '#64748B',
                fontWeight: 500,
                letterSpacing: '0.01em',
                marginTop: '1px'
            }}>
                MoSPI IPMD Sentinel
              </div>
            </div>)}
        </div>

        {/* Primary Navigation Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '14px' }}>
          {!sidebarCollapsed && (<div style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.08em',
                padding: '0 8px 4px',
                textTransform: 'uppercase'
            }}>
              Navigation
            </div>)}

          {primaryNavItems.map((item) => {
            const isActive = activeRoute === item.id ||
                (item.id === 'projects' && activeRoute === 'project-detail') ||
                (item.id === 'alerts' && activeRoute === 'risk-monitor');
            return (<button key={item.id} type="button" onClick={() => navigateTo(item.id)} title={sidebarCollapsed ? item.label : undefined} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '11px',
                    padding: sidebarCollapsed ? '10px 0' : '9px 12px',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    borderRadius: '12px',
                    backgroundColor: isActive ? '#1E293B' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 120ms ease',
                    boxShadow: isActive ? '0 2px 8px rgba(30, 41, 59, 0.22)' : 'none',
                    position: 'relative'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {item.icon(isActive)}
                  </span>
                  {!sidebarCollapsed && (<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>)}
                </div>

                {/* Red exception pill badge */}
                {item.badge && (<span style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: sidebarCollapsed ? '0' : '1px 6px',
                        borderRadius: '9999px',
                        minWidth: sidebarCollapsed ? '8px' : 'auto',
                        height: sidebarCollapsed ? '8px' : 'auto',
                        position: sidebarCollapsed ? 'absolute' : 'static',
                        top: sidebarCollapsed ? '6px' : 'auto',
                        right: sidebarCollapsed ? '8px' : 'auto'
                    }}>
                    {!sidebarCollapsed && item.badge}
                  </span>)}
              </button>);
        })}

          {/* Decision Tools Section */}
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
            {!sidebarCollapsed && (<div style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.08em',
                padding: '0 8px 4px',
                textTransform: 'uppercase'
            }}>
                Decision Tools
              </div>)}

            {toolsNavItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (<button key={item.id} type="button" onClick={() => navigateTo(item.id)} title={sidebarCollapsed ? item.label : undefined} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: sidebarCollapsed ? '9px 0' : '8px 12px',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#1E293B' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all 120ms ease',
                    boxShadow: isActive ? '0 2px 6px rgba(30, 41, 59, 0.2)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {item.icon(isActive)}
                    </span>
                    {!sidebarCollapsed && (<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>)}
                  </div>

                  {!sidebarCollapsed && item.badge && (<span style={{
                        backgroundColor: isActive ? '#334155' : '#F1F5F9',
                        color: isActive ? '#94A3B8' : '#64748B',
                        fontSize: '9px',
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: '4px'
                    }}>
                      {item.badge}
                    </span>)}
                </button>);
        })}
          </div>
        </div>
      </div>

      {/* Pinned Bottom Section: Officer Profile, Settings, & Collapse Button */}
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            paddingTop: '12px',
            borderTop: '1px solid #F1F5F9'
        }}>
        {/* Officer Profile / Accounts Manager */}
        <button type="button" onClick={() => navigateTo('admin')} title={sidebarCollapsed ? `Officer Profile (${user.name})` : undefined} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: sidebarCollapsed ? '8px 0' : '8px 10px',
            borderRadius: '10px',
            border: 'none',
            background: activeRoute === 'admin' ? '#1E293B' : 'transparent',
            color: activeRoute === 'admin' ? '#FFFFFF' : '#334155',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            transition: 'all 120ms ease'
        }}>
          <UserCheck size={16} color={activeRoute === 'admin' ? '#38BDF8' : '#64748B'}/>
          {!sidebarCollapsed && (<div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: activeRoute === 'admin' ? '#FFFFFF' : '#0F172A',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }}>
                {user.name}
              </div>
              <div style={{
                fontSize: '10px',
                color: activeRoute === 'admin' ? '#94A3B8' : '#64748B',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }}>
                {user.ministry ? (user.ministry.length > 20 ? `${user.ministry.substring(0, 18)}...` : user.ministry) : 'MoSPI National'}
              </div>
            </div>)}
        </button>

        {/* Settings */}
        <button type="button" onClick={() => navigateTo('admin')} title={sidebarCollapsed ? 'Settings' : undefined} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: sidebarCollapsed ? '8px 0' : '7px 10px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: '#475569',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            transition: 'all 120ms ease'
        }}>
          <Settings size={16} color="#64748B"/>
          {!sidebarCollapsed && <span>Settings</span>}
        </button>

        {/* Public Portal Link */}
        <button type="button" onClick={() => navigateTo('landing')} title={sidebarCollapsed ? 'Public Portal' : undefined} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: sidebarCollapsed ? '8px 0' : '6px 10px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: '#64748B',
            fontSize: '11px',
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
        }}>
          <ExternalLink size={14} color="#94A3B8"/>
          {!sidebarCollapsed && <span>Public Portal</span>}
        </button>

        {/* Sidebar Collapse Toggle Button */}
        <button type="button" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: sidebarCollapsed ? '8px 0' : '6px 10px',
            borderRadius: '10px',
            border: 'none',
            background: '#F8FAFC',
            color: '#64748B',
            fontSize: '11px',
            cursor: 'pointer',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            marginTop: '2px'
        }} title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
          {sidebarCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
          {!sidebarCollapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>);
};
