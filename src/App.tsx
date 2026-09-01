import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Views
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
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeRoute, notificationMessage } = useApp();

  const renderCurrentView = () => {
    switch (activeRoute) {
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
      case 'landing':
        return <LandingView />;
      case 'login':
        return <LoginView />;
      default:
        return <DashboardView />;
    }
  };

  const isFullscreenView = activeRoute === 'login';

  if (isFullscreenView) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-soft)' }}>
        {renderCurrentView()}
        {notificationMessage && (
          <div className="gov-toast">
            <CheckCircle2 size={16} color="var(--status-low-dot)" />
            <span>{notificationMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Collapsible Enterprise Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Notification Toast */}
      {notificationMessage && (
        <div className="gov-toast">
          <CheckCircle2 size={16} color="var(--status-low-dot)" />
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
