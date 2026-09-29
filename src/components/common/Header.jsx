import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    Home,
    FolderGit2,
    ShieldAlert,
    Sliders,
    Sparkles,
    FileText,
    Database,
    Map,
    ArrowRight
} from 'lucide-react';

export const Header = () => {
    const {
        activeRoute,
        selectedProjectId,
        selectedProject,
        reportingMonth,
        globalSearch,
        setGlobalSearch,
        projects,
        alerts,
        user,
        logoutUser,
        navigateTo,
        navigateToProject,
        setMobileNavOpen
    } = useApp();

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showInlineResults, setShowInlineResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState(globalSearch || '');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const inlineSearchInputRef = useRef(null);
    const modalSearchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Keep local search term in sync with globalSearch if updated from outside
    useEffect(() => {
        setSearchTerm(globalSearch || '');
    }, [globalSearch]);

    // Close inline results on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowInlineResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Global Keyboard shortcut Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (window.innerWidth >= 768 && inlineSearchInputRef.current) {
                    inlineSearchInputRef.current.focus();
                    inlineSearchInputRef.current.select();
                    setShowInlineResults(true);
                } else {
                    setShowSearchModal((prev) => !prev);
                }
            } else if (e.key === 'Escape') {
                setShowSearchModal(false);
                setShowInlineResults(false);
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

    // Filter dynamic results
    const searchResults = useMemo(() => {
        const query = (searchTerm || '').trim().toLowerCase();
        if (!query) {
            return {
                projects: [],
                alerts: [],
                navigation: [
                    { id: 'nav-1', route: 'dashboard', label: 'National Overview Dashboard', category: 'Views', icon: <Home size={13} className="text-sky-600" /> },
                    { id: 'nav-2', route: 'projects', label: 'Central Projects Directory', category: 'Views', icon: <FolderGit2 size={13} className="text-sky-600" /> },
                    { id: 'nav-3', route: 'alerts', label: 'Active Early Warning Signals', category: 'Views', icon: <ShieldAlert size={13} className="text-amber-600" /> },
                    { id: 'nav-4', route: 'simulator', label: 'What-If Policy Simulator', category: 'Tools', icon: <Sliders size={13} className="text-indigo-600" /> },
                    { id: 'nav-5', route: 'assistant', label: 'Sentinel AI Copilot', category: 'Tools', icon: <Sparkles size={13} className="text-purple-600" /> },
                    { id: 'nav-6', route: 'reports', label: 'Monthly Flash Reports & Dossiers', category: 'Views', icon: <FileText size={13} className="text-blue-600" /> },
                    { id: 'nav-7', route: 'data', label: 'Data Management & CUF', category: 'Tools', icon: <Database size={13} className="text-emerald-600" /> },
                    { id: 'nav-8', route: 'map', label: 'Geospatial Intelligence Map', category: 'Views', icon: <Map size={13} className="text-teal-600" /> }
                ],
                totalCount: 8
            };
        }

        // Matching projects
        const matchedProjects = (projects || [])
            .filter((p) => {
                const nameMatch = (p.name || '').toLowerCase().includes(query);
                const codeMatch = (p.code || p.id || '').toLowerCase().includes(query);
                const sectorMatch = (p.sector || '').toLowerCase().includes(query);
                const stateMatch = (p.state || '').toLowerCase().includes(query);
                const agencyMatch = (p.implementingAgency || '').toLowerCase().includes(query);
                const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(query));
                return nameMatch || codeMatch || sectorMatch || stateMatch || agencyMatch || tagMatch;
            })
            .slice(0, 5);

        // Matching alerts
        const matchedAlerts = (alerts || [])
            .filter((a) => {
                const projectMatch = (a.projectName || '').toLowerCase().includes(query);
                const typeMatch = (a.warningType || a.severity || '').toLowerCase().includes(query);
                const reasonMatch = (a.reason || '').toLowerCase().includes(query);
                return projectMatch || typeMatch || reasonMatch;
            })
            .slice(0, 3);

        // Matching navigation tools/views
        const navItems = [
            { id: 'nav-1', route: 'dashboard', label: 'National Overview Dashboard', category: 'Views', icon: <Home size={13} className="text-sky-600" /> },
            { id: 'nav-2', route: 'projects', label: 'Central Projects Explorer', category: 'Views', icon: <FolderGit2 size={13} className="text-sky-600" /> },
            { id: 'nav-3', route: 'alerts', label: 'Early Warnings & Risk Audit', category: 'Views', icon: <ShieldAlert size={13} className="text-amber-600" /> },
            { id: 'nav-4', route: 'simulator', label: 'What-If Policy Simulator', category: 'Tools', icon: <Sliders size={13} className="text-indigo-600" /> },
            { id: 'nav-5', route: 'assistant', label: 'Sentinel AI Assistant', category: 'Tools', icon: <Sparkles size={13} className="text-purple-600" /> },
            { id: 'nav-6', route: 'reports', label: 'Monthly Flash Reports', category: 'Views', icon: <FileText size={13} className="text-blue-600" /> },
            { id: 'nav-7', route: 'data', label: 'Data Management & CUF Upload', category: 'Tools', icon: <Database size={13} className="text-emerald-600" /> },
            { id: 'nav-8', route: 'map', label: 'India Geospatial Intelligence Map', category: 'Views', icon: <Map size={13} className="text-teal-600" /> }
        ].filter((item) => item.label.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));

        return {
            projects: matchedProjects,
            alerts: matchedAlerts,
            navigation: navItems,
            totalCount: matchedProjects.length + matchedAlerts.length + navItems.length
        };
    }, [searchTerm, projects, alerts]);

    const handleSelectProject = (projectId) => {
        setGlobalSearch(searchTerm);
        navigateToProject(projectId);
        setShowInlineResults(false);
        setShowSearchModal(false);
    };

    const handleSelectRoute = (route) => {
        setGlobalSearch(searchTerm);
        navigateTo(route);
        setShowInlineResults(false);
        setShowSearchModal(false);
    };

    const handleViewAllInProjects = () => {
        setGlobalSearch(searchTerm);
        navigateTo('projects');
        setShowInlineResults(false);
        setShowSearchModal(false);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (searchResults.projects.length === 1 && !searchResults.alerts.length) {
                handleSelectProject(searchResults.projects[0].id);
            } else {
                handleViewAllInProjects();
            }
        } else if (e.key === 'Escape') {
            setShowInlineResults(false);
            setShowSearchModal(false);
        }
    };

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

    const renderResultsList = () => {
        const hasQuery = Boolean((searchTerm || '').trim());
        const hasAny = searchResults.totalCount > 0;

        if (hasQuery && !hasAny) {
            return (
                <div className="p-6 text-center text-slate-500">
                    <Search size={24} className="mx-auto mb-2 text-slate-300" />
                    <div className="text-xs font-semibold text-slate-700">No results found for &ldquo;{searchTerm}&rdquo;</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                        Try searching by project name, corridor, agency, state, or ministry.
                    </div>
                </div>
            );
        }

        return (
            <div className="py-2 divide-y divide-slate-100">
                {/* Projects Section */}
                {searchResults.projects.length > 0 && (
                    <div className="p-2 space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Projects ({searchResults.projects.length})</span>
                            <span className="text-[9.5px] font-normal text-slate-400">Direct dossiers</span>
                        </div>
                        {searchResults.projects.map((p) => {
                            const isCritical = (p.status || '').toLowerCase().includes('critical') || (p.riskLevel || '').toLowerCase() === 'critical';
                            const isDelayed = (p.status || '').toLowerCase().includes('delay');
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => handleSelectProject(p.id)}
                                    className="p-2.5 rounded-lg hover:bg-sky-50/80 cursor-pointer transition flex items-start justify-between gap-3 group"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                                {p.code || p.id}
                                            </span>
                                            <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                                                {p.sector}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {p.state}
                                            </span>
                                        </div>
                                        <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 transition line-clamp-1">
                                            {p.name}
                                        </div>
                                        <div className="text-[10.5px] text-slate-500 mt-0.5 flex items-center gap-2">
                                            <span>₹ {p.originalCost?.toLocaleString('en-IN')} Cr</span>
                                            <span>·</span>
                                            <span>Progress: {p.physicalProgress?.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 pt-0.5">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                            isCritical
                                                ? 'bg-red-50 text-red-700 border border-red-200'
                                                : isDelayed
                                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        }`}>
                                            {p.status || 'On Track'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Early Warnings & Risk Signals */}
                {searchResults.alerts.length > 0 && (
                    <div className="p-2 space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Risk Signals & Early Warnings ({searchResults.alerts.length})
                        </div>
                        {searchResults.alerts.map((a) => (
                            <div
                                key={a.id}
                                onClick={() => {
                                    if (a.projectId) {
                                        handleSelectProject(a.projectId);
                                    } else {
                                        handleSelectRoute('alerts');
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-amber-50/70 cursor-pointer transition flex items-start gap-2.5"
                            >
                                <ShieldAlert size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[9.5px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded uppercase">
                                            {a.warningType || a.severity}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-900 truncate">
                                            {a.projectName}
                                        </span>
                                    </div>
                                    <p className="text-[10.5px] text-slate-600 line-clamp-1 m-0">
                                        {a.reason}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Navigation / Tools */}
                {searchResults.navigation.length > 0 && (
                    <div className="p-2 space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Quick Navigation & Tools
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {searchResults.navigation.map((nav) => (
                                <div
                                    key={nav.id}
                                    onClick={() => handleSelectRoute(nav.route)}
                                    className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition flex items-center justify-between gap-2 border border-slate-50"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        {nav.icon}
                                        <span className="text-xs text-slate-800 font-medium truncate">{nav.label}</span>
                                    </div>
                                    <ArrowRight size={11} className="text-slate-400 shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer action to search all in explorer */}
                {hasQuery && (
                    <div className="p-2 bg-slate-50">
                        <button
                            type="button"
                            onClick={handleViewAllInProjects}
                            className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                        >
                            <span>Explore all &ldquo;{searchTerm}&rdquo; in Projects Explorer</span>
                            <ArrowRight size={13} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

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

                {/* Center: Dynamic Interactive Search Bar with Live Dropdown */}
                <div ref={searchContainerRef} className="hidden md:block relative w-[240px] lg:w-[320px] xl:w-[380px]">
                    <div className="relative flex items-center">
                        <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                        <input
                            ref={inlineSearchInputRef}
                            type="text"
                            placeholder="Search projects, sectors, risks..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setGlobalSearch(e.target.value);
                                setShowInlineResults(true);
                            }}
                            onFocus={() => setShowInlineResults(true)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full pl-8 pr-16 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-sky-500 rounded-lg text-xs text-slate-900 outline-none transition shadow-2xs placeholder:text-slate-400"
                        />
                        <div className="absolute right-2 flex items-center gap-1">
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setGlobalSearch('');
                                        inlineSearchInputRef.current?.focus();
                                    }}
                                    className="p-0.5 text-slate-400 hover:text-slate-600 rounded bg-none border-none cursor-pointer"
                                    title="Clear search"
                                >
                                    <X size={13} />
                                </button>
                            )}
                            <span className="text-[9.5px] font-semibold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
                                Ctrl+K
                            </span>
                        </div>
                    </div>

                    {/* Live Results Dropdown */}
                    {showInlineResults && (
                        <div className="absolute top-full left-0 mt-1.5 w-[380px] lg:w-[440px] max-w-[calc(100vw-32px)] bg-white border border-slate-200 rounded-xl shadow-2xl z-200 max-h-[420px] overflow-y-auto animate-in fade-in zoom-in-95 duration-120">
                            {renderResultsList()}
                        </div>
                    )}
                </div>

                {/* Right Section: Actions, Notifications & User Profile */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative">
                    {/* Mobile Search Trigger Icon */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowSearchModal(true);
                            setTimeout(() => modalSearchInputRef.current?.focus(), 50);
                        }}
                        className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
                        aria-label="Open Search"
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
                            setShowInlineResults(false);
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
                                setShowInlineResults(false);
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

            {/* Global Dynamic Search Modal (Ctrl+K / Mobile Trigger) */}
            {showSearchModal && (
                <div
                    className="fixed inset-0 z-[350] bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-3"
                    onClick={() => setShowSearchModal(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Global Search Modal"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-[580px] max-w-[95vw] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
                    >
                        {/* Search Input Bar */}
                        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center gap-2.5 bg-white shrink-0">
                            <Search size={17} className="text-slate-400 shrink-0" />
                            <input
                                ref={modalSearchInputRef}
                                autoFocus
                                type="text"
                                placeholder="Search projects, corridors, ministries, or risk signals..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setGlobalSearch(e.target.value);
                                }}
                                onKeyDown={handleSearchKeyDown}
                                className="flex-1 bg-transparent border-none text-slate-900 text-sm sm:text-base outline-none"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setGlobalSearch('');
                                        modalSearchInputRef.current?.focus();
                                    }}
                                    className="bg-none border-none text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                                >
                                    <X size={15} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowSearchModal(false)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg p-1.5 cursor-pointer border-none flex items-center justify-center transition"
                                title="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Live Results Content */}
                        <div className="flex-1 overflow-y-auto">
                            {renderResultsList()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

;
