import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
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
    UserCheck,
    ExternalLink,
    X,
    LogOut
} from 'lucide-react';

export const Sidebar = () => {
    const {
        activeRoute,
        navigateTo,
        sidebarCollapsed,
        setSidebarCollapsed,
        scopedAlerts,
        user,
        logoutUser,
        mobileNavOpen,
        setMobileNavOpen
    } = useApp();

    const closeBtnRef = useRef(null);

    const criticalAlertsCount = (scopedAlerts || []).filter(
        (a) => a.severity.toLowerCase() === 'critical' && (a.status || '').toLowerCase() !== 'resolved'
    ).length;

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

    // Scroll lock and Escape key handling for mobile drawer
    useEffect(() => {
        if (!mobileNavOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                setMobileNavOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        const timer = setTimeout(() => closeBtnRef.current?.focus(), 50);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, [mobileNavOpen, setMobileNavOpen]);

    const renderNavContent = (isMobile = false) => {
        const isCollapsed = !isMobile && sidebarCollapsed;

        return (
            <div className="flex flex-col justify-between h-full min-h-0">
                {/* Top Section: Brand Emblem & Header */}
                <div className="overflow-y-auto overflow-x-hidden pr-0.5">
                    <div
                        onClick={() => {
                            navigateTo('dashboard');
                            if (isMobile) setMobileNavOpen(false);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '11px',
                            padding: isCollapsed ? '4px 0 14px' : '4px 6px 14px',
                            borderBottom: '1px solid #F1F5F9',
                            cursor: 'pointer',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                        title="PAIMANA Sentinel AI"
                    >
                        {/* PAIMANA Sentinel National Tech Emblem */}
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                backgroundColor: '#0F172A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
                                flexShrink: 0
                            }}
                        >
                            <span
                                style={{
                                    color: '#FFFFFF',
                                    fontWeight: 900,
                                    fontSize: '17px',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                P
                            </span>
                        </div>

                        {!isCollapsed && (
                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                <div
                                    style={{
                                        fontSize: '14.5px',
                                        fontWeight: 800,
                                        color: '#0F172A',
                                        letterSpacing: '-0.02em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    PAIMANA
                                    <span
                                        style={{
                                            fontSize: '9.5px',
                                            fontWeight: 700,
                                            backgroundColor: '#0284C7',
                                            color: '#FFFFFF',
                                            padding: '1px 5px',
                                            borderRadius: '5px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em'
                                        }}
                                    >
                                        AI
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: '#64748B',
                                        fontWeight: 500,
                                        letterSpacing: '0.01em',
                                        marginTop: '1px'
                                    }}
                                >
                                    MoSPI IPMD Sentinel
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary Navigation Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '14px' }}>
                        {!isCollapsed && (
                            <div
                                style={{
                                    fontSize: '9.5px',
                                    fontWeight: 700,
                                    color: '#94A3B8',
                                    letterSpacing: '0.08em',
                                    padding: '0 8px 4px',
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
                                    onClick={() => {
                                        navigateTo(item.id);
                                        if (isMobile) setMobileNavOpen(false);
                                    }}
                                    title={isCollapsed ? item.label : undefined}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '11px',
                                        padding: isCollapsed ? '10px 0' : '9px 12px',
                                        justifyContent: isCollapsed ? 'center' : 'space-between',
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
                                        position: 'relative',
                                        minHeight: isMobile ? '44px' : 'auto'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                            {item.icon(isActive)}
                                        </span>
                                        {!isCollapsed && (
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.label}
                                            </span>
                                        )}
                                    </div>

                                    {/* Red exception pill badge */}
                                    {item.badge && (
                                        <span
                                            style={{
                                                backgroundColor: '#EF4444',
                                                color: '#FFFFFF',
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                padding: isCollapsed ? '0' : '1px 6px',
                                                borderRadius: '9999px',
                                                minWidth: isCollapsed ? '8px' : 'auto',
                                                height: isCollapsed ? '8px' : 'auto',
                                                position: isCollapsed ? 'absolute' : 'static',
                                                top: isCollapsed ? '6px' : 'auto',
                                                right: isCollapsed ? '8px' : 'auto'
                                            }}
                                        >
                                            {!isCollapsed && item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {/* Decision Tools Section */}
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                            {!isCollapsed && (
                                <div
                                    style={{
                                        fontSize: '9.5px',
                                        fontWeight: 700,
                                        color: '#94A3B8',
                                        letterSpacing: '0.08em',
                                        padding: '0 8px 4px',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Decision Tools
                                </div>
                            )}

                            {toolsNavItems.map((item) => {
                                const isActive = activeRoute === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            navigateTo(item.id);
                                            if (isMobile) setMobileNavOpen(false);
                                        }}
                                        title={isCollapsed ? item.label : undefined}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: isCollapsed ? '9px 0' : '8px 12px',
                                            justifyContent: isCollapsed ? 'center' : 'space-between',
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
                                            boxShadow: isActive ? '0 2px 6px rgba(30, 41, 59, 0.2)' : 'none',
                                            minHeight: isMobile ? '44px' : 'auto'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                                {item.icon(isActive)}
                                            </span>
                                            {!isCollapsed && (
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>

                                        {!isCollapsed && item.badge && (
                                            <span
                                                style={{
                                                    backgroundColor: isActive ? '#334155' : '#F1F5F9',
                                                    color: isActive ? '#94A3B8' : '#64748B',
                                                    fontSize: '9px',
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
                </div>

                {/* Pinned Bottom Section: Officer Profile, Settings, Public Portal & Collapse / Sign-out */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        paddingTop: '12px',
                        borderTop: '1px solid #F1F5F9',
                        flexShrink: 0
                    }}
                >
                    {/* Officer Profile */}
                    <button
                        type="button"
                        onClick={() => {
                            navigateTo('admin');
                            if (isMobile) setMobileNavOpen(false);
                        }}
                        title={isCollapsed ? `Officer Profile (${user.name})` : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: isCollapsed ? '8px 0' : '8px 10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeRoute === 'admin' ? '#1E293B' : 'transparent',
                            color: activeRoute === 'admin' ? '#FFFFFF' : '#334155',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            transition: 'all 120ms ease'
                        }}
                    >
                        <UserCheck size={16} color={activeRoute === 'admin' ? '#38BDF8' : '#64748B'}/>
                        {!isCollapsed && (
                            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: activeRoute === 'admin' ? '#FFFFFF' : '#0F172A',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {user.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: activeRoute === 'admin' ? '#94A3B8' : '#64748B',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {user.ministry ? (user.ministry.length > 20 ? `${user.ministry.substring(0, 18)}...` : user.ministry) : 'MoSPI National'}
                                </div>
                            </div>
                        )}
                    </button>

                    {/* Settings */}
                    <button
                        type="button"
                        onClick={() => {
                            navigateTo('admin');
                            if (isMobile) setMobileNavOpen(false);
                        }}
                        title={isCollapsed ? 'Settings' : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: isCollapsed ? '8px 0' : '7px 10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'transparent',
                            color: '#475569',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            transition: 'all 120ms ease'
                        }}
                    >
                        <Settings size={16} color="#64748B"/>
                        {!isCollapsed && <span>Settings</span>}
                    </button>

                    {/* Public Portal Link */}
                    <button
                        type="button"
                        onClick={() => {
                            navigateTo('landing');
                            if (isMobile) setMobileNavOpen(false);
                        }}
                        title={isCollapsed ? 'Public Portal' : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: isCollapsed ? '8px 0' : '6px 10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'transparent',
                            color: '#64748B',
                            fontSize: '11px',
                            cursor: 'pointer',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                    >
                        <ExternalLink size={14} color="#94A3B8"/>
                        {!isCollapsed && <span>Public Portal</span>}
                    </button>

                    {/* Mobile Sign Out Button */}
                    {isMobile && (
                        <button
                            type="button"
                            onClick={() => {
                                logoutUser();
                                setMobileNavOpen(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '4px'
                            }}
                        >
                            <LogOut size={14}/>
                            <span>Sign Out Session</span>
                        </button>
                    )}

                    {/* Desktop Sidebar Collapse Toggle Button */}
                    {!isMobile && (
                        <button
                            type="button"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: isCollapsed ? '8px 0' : '6px 10px',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#F8FAFC',
                                color: '#64748B',
                                fontSize: '11px',
                                cursor: 'pointer',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                marginTop: '2px'
                            }}
                            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        >
                            {sidebarCollapsed ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>}
                            {!sidebarCollapsed && <span>Collapse sidebar</span>}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Desktop Floating Sidebar (Visible on large screens >= 1024px) */}
            <aside
                className={`floating-sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'} hidden lg:flex`}
                style={{
                    width: sidebarCollapsed ? '68px' : '236px',
                    margin: '12px 0 12px 14px',
                    height: 'calc(100vh - 24px)',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '22px',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 4px 24px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
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
                }}
            >
                {renderNavContent(false)}
            </aside>

            {/* Mobile Navigation Drawer & Backdrop (< 1024px) */}
            {mobileNavOpen && (
                <div
                    className="fixed inset-0 z-[300] lg:hidden flex justify-start animate-in fade-in duration-150"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Navigation Menu"
                >
                    {/* Dark Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileNavOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sliding Drawer Container */}
                    <div
                        className="relative w-[280px] max-w-[85vw] h-full bg-white shadow-2xl z-10 p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Drawer Top Bar with Close Button */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</span>
                            <button
                                ref={closeBtnRef}
                                type="button"
                                onClick={() => setMobileNavOpen(false)}
                                aria-label="Close navigation drawer"
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition"
                            >
                                <X size={16}/>
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto">
                            {renderNavContent(true)}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

