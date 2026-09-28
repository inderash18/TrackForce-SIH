import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Calendar, ChevronDown, LogOut, Menu, X, ShieldCheck, ExternalLink, Home } from 'lucide-react';

export const Header = () => {
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
        mobileNavOpen,
        setMobileNavOpen
    } = useApp();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

    // Keyboard shortcut Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearchModal((prev) => !prev);
            }
            else if (e.key === 'Escape') {
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
                    title: 'Project Details',
                    breadcrumb: `Projects / ${selectedProject ? selectedProject.code : selectedProjectId}`
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
                className="w-full sticky top-0 z-100 flex items-center justify-between px-3 sm:px-6 bg-[var(--color-surface-nav)] border-b border-[var(--color-border)] shadow-xs"
                style={{ height: 'var(--header-height)' }}
            >
                {/* Left Section: Mobile Menu Trigger + Breadcrumb & Dynamic Title */}
                <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1 mr-2">
                    <button
                        type="button"
                        onClick={() => setMobileNavOpen(true)}
                        className="mobile-menu-btn flex lg:hidden items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0 transition"
                        aria-label="Open mobile navigation menu"
                    >
                        <Menu size={18} />
                    </button>

                    <div className="min-w-0">
                        <div className="text-[10.5px] font-semibold text-[var(--color-text-muted)] tracking-wider uppercase truncate">
                            {breadcrumb}
                        </div>
                        <h1 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] tracking-tight m-0 leading-tight truncate">
                            {title}
                        </h1>
                    </div>
                </div>

                {/* Center / Search Bar (Responsive) */}
                <div className="hidden md:flex items-center gap-3">
                    <div
                        onClick={() => setShowSearchModal(true)}
                        className="flex items-center gap-2 bg-[var(--color-surface-panel)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3.5 py-1.5 cursor-pointer min-w-[200px] lg:min-w-[240px] transition shadow-2xs hover:border-slate-300"
                    >
                        <Search size={14} color="var(--color-text-muted)" />
                        <span className="text-xs truncate flex-1" style={{ color: globalSearch ? 'var(--color-text-primary)' : 'var(--color-text-dim)' }}>
                            {globalSearch || 'Search projects, sectors...'}
                        </span>
                        <span className="text-[10px] font-semibold bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                            Ctrl+K
                        </span>
                    </div>
                </div>

                {/* Right Section: Actions, Notifications & User Profile */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
                    {/* Mobile Search Trigger Icon */}
                    <button
                        type="button"
                        onClick={() => setShowSearchModal(true)}
                        className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                        aria-label="Search"
                    >
                        <Search size={15} />
                    </button>

                    {/* Public Portal Link */}
                    <button
                        type="button"
                        onClick={() => navigateTo('landing')}
                        className="btn-secondary text-[11.5px] px-2 sm:px-2.5 h-8 font-semibold flex items-center gap-1"
                        title="Go to Public PAIMANA Portal"
                    >
                        <Home size={13} color="var(--color-action-primary)" />
                        <span className="hidden sm:inline">Public Portal</span>
                    </button>

                    {/* Reporting Period Badge (hidden on extra small screens) */}
                    <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-surface-panel)] border border-[var(--color-border)] rounded-full text-[11.5px] text-[var(--color-text-secondary)] font-medium">
                        <Calendar size={13} color="var(--color-action-primary)" />
                        <span>{reportingMonth}</span>
                    </div>

                    {/* Notifications Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowUserMenu(false);
                        }}
                        className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-[var(--radius-md)] border border-[var(--color-border)] flex items-center justify-center cursor-pointer relative transition ${
                            showNotifications ? 'bg-[var(--color-surface-hover)]' : 'bg-[var(--color-surface-panel)]'
                        }`}
                        title="Early Warning Notifications"
                        aria-label="Early Warning Notifications"
                    >
                        <Bell size={15} />
                        {activeAlertsCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--status-critical)] text-white text-[9px] font-bold flex items-center justify-center border-2 border-[var(--color-surface-nav)]">
                                {activeAlertsCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Flyout */}
                    {showNotifications && (
                        <div
                            className="absolute top-11 right-0 w-[320px] sm:w-[360px] max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-xl shadow-xl z-200 overflow-hidden animate-in fade-in duration-150"
                        >
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="text-xs font-bold text-slate-800">
                                    Early Warnings ({alerts.length})
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigateTo('alerts');
                                        setShowNotifications(false);
                                    }}
                                    className="text-[11px] text-sky-600 hover:text-sky-800 bg-none border-none cursor-pointer font-semibold"
                                >
                                    View All Signals
                                </button>
                            </div>

                            <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100">
                                {alerts.slice(0, 4).map((alert) => (
                                    <div
                                        key={alert.id}
                                        onClick={() => {
                                            navigateTo('alerts');
                                            setShowNotifications(false);
                                        }}
                                        className="p-3.5 hover:bg-slate-50 cursor-pointer transition"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded uppercase">
                                                {alert.warningType || alert.severity}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {alert.timestamp || 'Fresh Signal'}
                                            </span>
                                        </div>
                                        <div className="text-xs font-semibold text-slate-900 mb-0.5 line-clamp-1">
                                            {alert.projectName}
                                        </div>
                                        <p className="text-[11px] text-slate-600 m-0 line-clamp-2 leading-relaxed">
                                            {alert.reason}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* User Profile Button & Dropdown Menu */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            className={`flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg border border-[var(--color-border)] cursor-pointer text-[var(--color-text-primary)] transition ${
                                showUserMenu ? 'bg-[var(--color-surface-hover)]' : 'bg-[var(--color-surface-panel)]'
                            }`}
                            aria-label="User Account Menu"
                        >
                            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <ChevronDown size={13} className="text-slate-500 hidden sm:block" />
                        </button>

                        {showUserMenu && (
                            <div
                                className="absolute top-11 right-0 w-[220px] max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-xl shadow-xl z-200 p-3 flex flex-col gap-2 animate-in fade-in duration-150"
                            >
                                <div className="border-b border-slate-100 pb-2">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-[11px] text-slate-500 truncate">
                                        {user.email}
                                    </div>
                                    <div className="text-[10px] text-sky-600 mt-0.5 font-medium">
                                        {user.role} · {user.badge}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigateTo('admin');
                                        setShowUserMenu(false);
                                    }}
                                    className="btn-ghost w-full justify-start text-xs p-1.5 flex items-center gap-2"
                                >
                                    <ShieldCheck size={14} /> System Access & Roles
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        logoutUser();
                                        setShowUserMenu(false);
                                    }}
                                    className="btn-ghost w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 flex items-center gap-2"
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
                    className="fixed inset-0 z-[350] bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-3"
                    onClick={() => setShowSearchModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Global Search"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-[560px] max-w-[95vw] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
                    >
                        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center gap-2.5">
                            <Search size={17} className="text-slate-500" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search projects, corridors, ministries, or risk signals..."
                                value={globalSearch}
                                onChange={(e) => setGlobalSearch(e.target.value)}
                                className="flex-1 bg-transparent border-none text-slate-900 text-sm sm:text-base outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowSearchModal(false)}
                                className="bg-none border-none text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-3 sm:p-4 max-h-[300px] overflow-y-auto space-y-1">
                            <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Quick Navigation
                            </div>
                            {[
                                { route: 'dashboard', label: 'National Overview Dashboard' },
                                { route: 'projects', label: 'Central Projects Explorer' },
                                { route: 'alerts', label: 'Active Early Warning Signals' },
                                { route: 'simulator', label: 'What-If Policy & Intervention Simulator' },
                                { route: 'map', label: 'India Geospatial Intelligence Map' },
                                { route: 'reports', label: 'Monthly Flash Reports & Dossiers' }
                            ].map((item) => (
                                <button
                                    key={item.route}
                                    type="button"
                                    onClick={() => {
                                        navigateTo(item.route);
                                        setShowSearchModal(false);
                                    }}
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 text-xs sm:text-sm text-left transition cursor-pointer"
                                >
                                    <span>{item.label}</span>
                                    <ExternalLink size={13} className="text-slate-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
;
