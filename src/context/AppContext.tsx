import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ActiveNavRoute, Project, EarlyWarningAlert, SimulationParams, SimulationResult } from '../types/project';
import { mockProjects } from '../data/projectsData';
import { mockEarlyWarnings } from '../data/earlyWarningsData';

export interface UserProfile {
  name: string;
  role: 'admin' | 'analyst' | 'officer' | 'viewer' | string;
  department: string;
  email: string;
  ministry: string; // e.g. "Ministry of Railways"
  authorizedMinistries: string[]; // e.g. ["Ministry of Railways"] or ["ALL"]
  isNationalOversight: boolean;
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

  // Global Filters & Scope
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

  // Scoped & Full Data
  projects: Project[];
  scopedProjects: Project[];
  alerts: EarlyWarningAlert[];
  scopedAlerts: EarlyWarningAlert[];
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
  switchDemoRole: (roleType: 'railways' | 'morth' | 'national_admin') => void;
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

  const landBenefit = (params.landAcquisitionPct - baseProject.cuf.landAcquisitionPct) * 0.35;
  const contractorBenefit = (params.contractorCapacity - baseProject.cuf.contractorCapacity) * 0.30;
  const progressBenefit = (params.monthlyProgressRate - 0.5) * 12;
  const fundingBenefit = (params.fundingAvailability - 60) * 0.15;
  const clearanceBenefit = (params.clearanceSpeed - 50) * 0.20;
  const resourceBenefit = (params.resourceDeployment - 40) * 0.18;

  const totalPointsReduction = Math.max(
    0,
    Math.min(65, Math.round(landBenefit + contractorBenefit + progressBenefit + fundingBenefit + clearanceBenefit + resourceBenefit))
  );

  const simRisk = Math.max(15, Math.min(99, baseRisk - totalPointsReduction));
  const simDelayProb = Math.max(12, Math.min(98, Math.round(baseDelay - totalPointsReduction * 0.95)));
  const simCostProb = Math.max(14, Math.min(95, Math.round(baseCost - totalPointsReduction * 0.85)));
  const delayMonthsReduction = parseFloat((totalPointsReduction / 6.5).toFixed(1));

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
  const [activeRoute, setActiveRoute] = useState<ActiveNavRoute>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-602096');
  const [projects] = useState<Project[]>(mockProjects);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(mockEarlyWarnings);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Global Filter State
  const [reportingMonth, setReportingMonth] = useState<string>('September 2026');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('All Ministries');
  const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Default user: Ministry of Railways Officer
  const [user, setUser] = useState<UserProfile>({
    name: 'Ananya Sengupta',
    role: 'officer',
    department: 'Railway Board Planning & Execution',
    email: 'railways.officer@gov.in',
    ministry: 'Ministry of Railways',
    authorizedMinistries: ['Ministry of Railways'],
    isNationalOversight: false,
    agency: 'Indian Railways / NHSRCL / DFCCIL',
    badge: 'Ministry Nodal Officer',
    isLoggedIn: true
  });

  // Ministry Scoped Projects
  const scopedProjects = useMemo(() => {
    if (user.isNationalOversight) {
      if (selectedMinistry && selectedMinistry !== 'All Ministries') {
        return projects.filter((p) => p.ministry.toLowerCase().includes(selectedMinistry.toLowerCase()));
      }
      return projects;
    }
    return projects.filter((p) =>
      user.authorizedMinistries.some(
        (m) => m === 'ALL' || p.ministry.toLowerCase().includes(m.toLowerCase())
      )
    );
  }, [projects, user, selectedMinistry]);

  // Ministry Scoped Alerts
  const scopedAlerts = useMemo(() => {
    if (user.isNationalOversight) {
      if (selectedMinistry && selectedMinistry !== 'All Ministries') {
        return alerts.filter((a) => (a.ministry || '').toLowerCase().includes(selectedMinistry.toLowerCase()));
      }
      return alerts;
    }
    return alerts.filter((a) =>
      user.authorizedMinistries.some(
        (m) => m === 'ALL' || (a.ministry || '').toLowerCase().includes(m.toLowerCase())
      )
    );
  }, [alerts, user, selectedMinistry]);

  const selectedProject =
    scopedProjects.find((p) => p.id === selectedProjectId) ||
    projects.find((p) => p.id === selectedProjectId) ||
    projects[0];

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
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          return {
            ...a,
            status,
            assignedOfficer: note ? `${user.name} (${note})` : a.assignedOfficer || user.name
          };
        }
        return a;
      })
    );
    showNotification(`Alert ${alertId} updated to ${status.toUpperCase()}.`);
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
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('railway')) {
      switchDemoRole('railways');
    } else if (lowerEmail.includes('morth') || lowerEmail.includes('road') || lowerEmail.includes('highway')) {
      switchDemoRole('morth');
    } else {
      switchDemoRole('national_admin');
    }
    setActiveRoute('dashboard');
    showNotification(`Logged in successfully as ${email}.`);
  };

  const switchDemoRole = (roleType: 'railways' | 'morth' | 'national_admin') => {
    if (roleType === 'railways') {
      setUser({
        name: 'Ananya Sengupta',
        role: 'officer',
        department: 'Railway Board Planning & Execution',
        email: 'railways.officer@gov.in',
        ministry: 'Ministry of Railways',
        authorizedMinistries: ['Ministry of Railways'],
        isNationalOversight: false,
        agency: 'Indian Railways / NHSRCL / DFCCIL',
        badge: 'Ministry Nodal Officer',
        isLoggedIn: true
      });
      setSelectedMinistry('Ministry of Railways');
    } else if (roleType === 'morth') {
      setUser({
        name: 'Col. Hardeep Singh',
        role: 'officer',
        department: 'Highways & Expressways Division',
        email: 'morth.officer@gov.in',
        ministry: 'Ministry of Road Transport and Highways',
        authorizedMinistries: ['Ministry of Road Transport and Highways'],
        isNationalOversight: false,
        agency: 'NHAI / NHIDCL',
        badge: 'Highways Nodal Officer',
        isLoggedIn: true
      });
      setSelectedMinistry('Ministry of Road Transport and Highways');
    } else {
      setUser({
        name: 'Dr. Rajeshwar Rao, IAS',
        role: 'admin',
        department: 'Infrastructure and Project Monitoring Division (IPMD)',
        email: 'admin@mospi.gov.in',
        ministry: 'Ministry of Statistics and Programme Implementation',
        authorizedMinistries: ['ALL'],
        isNationalOversight: true,
        agency: 'MoSPI National Monitoring Cell',
        badge: 'National Oversight Apex',
        isLoggedIn: true
      });
      setSelectedMinistry('All Ministries');
    }
    showNotification(`Active account context switched.`);
  };

  const logoutUser = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
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
        scopedProjects,
        alerts,
        scopedAlerts,
        updateAlertStatus,
        simulationParams,
        setSimulationParams,
        simulationResult,
        runSimulation,
        resetSimulation,
        user,
        loginUser,
        logoutUser,
        switchDemoRole,
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
