import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
// Core Workspace Views
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { ProjectDetailView } from './views/ProjectDetailView';
import { RiskMonitorView } from './views/RiskMonitorView';
import { EarlyWarningsView } from './views/EarlyWarningsView';
import { AnalyticsView } from './views/AnalyticsView';
import { BenchmarkingView } from './views/BenchmarkingView';
import { MapIntelligenceView } from './views/MapIntelligenceView';
import { SimulatorView } from './views/SimulatorView';
import { AssistantView } from './views/AssistantView';
import { ReportsView } from './views/ReportsView';
import { DataManagementView } from './views/DataManagementView';
import { ModelPerformanceView } from './views/ModelPerformanceView';
import { AdminView } from './views/AdminView';
// PAIMANA Portal & Reference Subpages
import { LandingView } from './views/LandingView';
import { PublicDashboardView } from './views/PublicDashboardView';
import { ProjectMonitoringReportsView } from './views/ProjectMonitoringReportsView';
import { PerformanceMonitoringReportsView } from './views/PerformanceMonitoringReportsView';
import { AboutPagesView } from './views/AboutPagesView';
import { OrdersAndManualsView } from './views/OrdersAndManualsView';
import { FAQView } from './views/FAQView';
import { SitemapView } from './views/SitemapView';
import { ContactView } from './views/ContactView';
import { LoginView } from './views/LoginView';
import { CheckCircle2 } from 'lucide-react';
const AppContent = () => {
    const { activeRoute, setActiveRoute, notificationMessage } = useApp();
    const handleNavigate = (route) => {
        setActiveRoute(route);
    };
    const handleOpenAddProject = () => {
        setActiveRoute('login');
    };
    const handleOpenLoginModal = () => {
        setActiveRoute('login');
    };
    const renderCurrentView = () => {
        switch (activeRoute) {
            // Public / Reference PAIMANA Pages
            case 'landing':
                return <LandingView />;
            case 'public-dashboard':
                return (<PublicDashboardView onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'project-monitoring':
                return (<ProjectMonitoringReportsView isArchiveMode={false} onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'archive-project-monitoring':
                return (<ProjectMonitoringReportsView isArchiveMode={true} onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'performance-monitoring':
                return (<PerformanceMonitoringReportsView isArchiveMode={false} onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'archive-project-performance':
                return (<PerformanceMonitoringReportsView isArchiveMode={true} onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'about-ipmd':
                return (<AboutPagesView subpage="ipmd" onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'about-ocms':
                return (<AboutPagesView subpage="ocms" onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'about-vision':
                return (<AboutPagesView subpage="vision" onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'orders-manuals':
                return (<OrdersAndManualsView onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'faq':
                return (<FAQView onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'sitemap':
                return (<SitemapView onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'contact':
                return (<ContactView onNavigate={handleNavigate} onOpenAddProject={handleOpenAddProject} onOpenLoginModal={handleOpenLoginModal}/>);
            case 'login':
                return <LoginView />;
            // Internal Authenticated Enterprise Workspace Views
            case 'dashboard':
                return <DashboardView />;
            case 'projects':
                return <ProjectsView />;
            case 'project-detail':
                return <ProjectDetailView />;
            case 'risk-monitor':
                return <RiskMonitorView />;
            case 'alerts':
                return <EarlyWarningsView />;
            case 'analytics':
                return <AnalyticsView />;
            case 'benchmarking':
                return <BenchmarkingView />;
            case 'map':
                return <MapIntelligenceView />;
            case 'simulator':
                return <SimulatorView />;
            case 'assistant':
                return <AssistantView />;
            case 'reports':
                return <ReportsView />;
            case 'data':
                return <DataManagementView />;
            case 'model-performance':
                return <ModelPerformanceView />;
            case 'admin':
                return <AdminView />;
            default:
                return <LandingView />;
        }
    };
    // Fullscreen view routes (no enterprise sidebar, custom 3-tier government header/footer)
    const publicRoutes = [
        'landing',
        'public-dashboard',
        'project-monitoring',
        'performance-monitoring',
        'archive-project-monitoring',
        'archive-project-performance',
        'about-ipmd',
        'about-ocms',
        'about-vision',
        'orders-manuals',
        'faq',
        'sitemap',
        'contact',
        'login'
    ];
    const isFullscreenView = publicRoutes.includes(activeRoute);
    if (isFullscreenView) {
        return (<div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-app)' }}>
        {renderCurrentView()}
        {notificationMessage && (<div className="gov-toast">
            <CheckCircle2 size={16} color="var(--status-low-dot)"/>
            <span>{notificationMessage}</span>
          </div>)}
      </div>);
    }
    return (<div className="app-container">
      {/* Collapsible Enterprise Sidebar for Workspace Routes */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Notification Toast */}
      {notificationMessage && (<div className="gov-toast">
          <CheckCircle2 size={16} color="var(--status-low-dot)"/>
          <span>{notificationMessage}</span>
        </div>)}
    </div>);
};
export default function App() {
    return (<AppProvider>
      <AppContent />
    </AppProvider>);
}
