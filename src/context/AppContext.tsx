import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ActiveNavRoute, Project, EarlyWarningAlert, SimulationParams, SimulationResult } from '../types/project';
import { mockProjects } from '../data/projectsData';
import { mockEarlyWarnings } from '../data/earlyWarningsData';

interface UserProfile {
  name: string;
  role: string;
  department: string;
  email: string;
  agency: string;
  badge: string;
  isLoggedIn: boolean;
}

interface AppContextType {
  activeRoute: ActiveNavRoute;
  setActiveRoute: (route: ActiveNavRoute) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project;
  navigateToProject: (projectId: string) => void;
  navigateTo: (route: ActiveNavRoute, projectId?: string) => void;
  
  // Global Filters
  reportingMonth: string;
  setReportingMonth: (m: string) => void;
  selectedMinistry: string;
  setSelectedMinistry: (min: string) => void;
  selectedSector: string;
  setSelectedSector: (sec: string) => void;
  selectedState: string;
  setSelectedState: (st: string) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Projects & Alerts State
  projects: Project[];
  alerts: EarlyWarningAlert[];
  updateAlertStatus: (alertId: string, status: EarlyWarningAlert['status'], note?: string) => void;
  
  // What-If Simulator
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  simulationResult: SimulationResult;
  runSimulation: (params: SimulationParams) => void;
  resetSimulation: () => void;

  // User Auth & Notification
  user: UserProfile;
  loginUser: (email: string) => void;
  logoutUser: () => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
  
  // Sidebar State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
}

const defaultSimulationParams: SimulationParams = {
  physicalProgress: 58,
  monthlyProgressRate: 0.5,
  fundingAvailability: 60,
  contractorCapacity: 45,
  landAcquisitionPct: 78,
  clearanceSpeed: 50,
  resourceDeployment: 40
};

const calculateSimResult = (params: SimulationParams, baseProject: Project): SimulationResult => {
  const baseRisk = baseProject.riskScore;
  const baseDelay = baseProject.scheduleDelayProbability;
  const baseCost = baseProject.costOverrunProbability;

  // Calculation formula based on multi-variable risk coefficients
  const landBenefit = ((params.landAcquisitionPct - baseProject.cuf.landAcquisitionPct) * 0.35);
  const contractorBenefit = ((params.contractorCapacity - baseProject.cuf.contractorCapacity) * 0.30);
  const progressBenefit = ((params.monthlyProgressRate - 0.5) * 12);
  const fundingBenefit = ((params.fundingAvailability - 60) * 0.15);
  const clearanceBenefit = ((params.clearanceSpeed - 50) * 0.20);
  const resourceBenefit = ((params.resourceDeployment - 40) * 0.18);

  const totalPointsReduction = Math.max(0, Math.min(65, Math.round(
    landBenefit + contractorBenefit + progressBenefit + fundingBenefit + clearanceBenefit + resourceBenefit
  )));

  const simRisk = Math.max(15, Math.min(99, baseRisk - totalPointsReduction));
  const simDelayProb = Math.max(12, Math.min(98, Math.round(baseDelay - (totalPointsReduction * 0.95))));
  const simCostProb = Math.max(14, Math.min(95, Math.round(baseCost - (totalPointsReduction * 0.85))));
  const delayMonthsReduction = parseFloat(((totalPointsReduction / 6.5)).toFixed(1));

  return {
    baselineRiskScore: baseRisk,
    simulatedRiskScore: simRisk,
    riskReductionPoints: totalPointsReduction,
    baselineDelayProbability: baseDelay,
    simulatedDelayProbability: simDelayProb,
    baselineCostRisk: baseCost,
    simulatedCostRisk: simCostProb,
    expectedDelayReductionMonths: delayMonthsReduction,
    confidence: 'High (XGBoost Ensemble v2.4)'
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState<ActiveNavRoute>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-602096');
  const [projects] = useState<Project[]>(mockProjects);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(mockEarlyWarnings);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Global Filter State
  const [reportingMonth, setReportingMonth] = useState<string>('April 2026');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('All Ministries');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // User State
  const [user, setUser] = useState<UserProfile>({
    name: 'Dr. Rajiv Verma, IAS',
    role: 'MoSPI Administrator',
    department: 'Infrastructure and Project Monitoring Division (IPMD)',
    email: 'r.verma-ias@gov.in',
    agency: 'Ministry of Statistics & Programme Implementation',
    badge: 'Apex Clearance',
    isLoggedIn: true
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Simulation State
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(defaultSimulationParams);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(
    calculateSimResult(defaultSimulationParams, selectedProject)
  );

  const runSimulation = (params: SimulationParams) => {
    setSimulationParams(params);
    setSimulationResult(calculateSimResult(params, selectedProject));
  };

  const resetSimulation = () => {
    setSimulationParams(defaultSimulationParams);
    setSimulationResult(calculateSimResult(defaultSimulationParams, selectedProject));
  };

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const updateAlertStatus = (alertId: string, status: EarlyWarningAlert['status'], note?: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status,
          assignedOfficer: note ? `${user.name} (${note})` : a.assignedOfficer || user.name
        };
      }
      return a;
    }));
    showNotification(`Alert ${alertId} marked as ${status.toUpperCase()}.`);
  };

  const navigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveRoute('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (route: ActiveNavRoute, projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (email: string) => {
    setUser(prev => ({ ...prev, email, isLoggedIn: true }));
    setActiveRoute('dashboard');
    showNotification('Logged in successfully to PAIMANA Sentinel AI.');
  };

  const logoutUser = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    setActiveRoute('login');
    showNotification('Logged out from official session.');
  };

  return (
    <AppContext.Provider
      value={{
        activeRoute,
        setActiveRoute,
        selectedProjectId,
        setSelectedProjectId,
        selectedProject,
        navigateToProject,
        navigateTo,
        reportingMonth,
        setReportingMonth,
        selectedMinistry,
        setSelectedMinistry,
        selectedSector,
        setSelectedSector,
        selectedState,
        setSelectedState,
        globalSearch,
        setGlobalSearch,
        projects,
        alerts,
        updateAlertStatus,
        simulationParams,
        setSimulationParams,
        simulationResult,
        runSimulation,
        resetSimulation,
        user,
        loginUser,
        logoutUser,
        notificationMessage,
        showNotification,
        sidebarCollapsed,
        setSidebarCollapsed
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
