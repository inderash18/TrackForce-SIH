export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface MonthlyProgressPoint {
  month: string;
  actualProgress: number;
  expectedProgress: number;
  expenditure: number; // in ₹ Cr
  riskScore: number;
}

export interface ShapContributor {
  factor: string;
  contribution: number; // e.g. +23%
  direction: 'increase' | 'decrease';
  explanation: string;
  category: 'progress' | 'schedule' | 'financial' | 'historical' | 'milestone' | 'clearance';
}

export interface RecommendedIntervention {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  reason: string;
  expectedImpact: string;
  delayRiskBefore: number;
  delayRiskAfter: number;
  riskScoreBefore: number;
  riskScoreAfter: number;
  status: 'suggested' | 'in-review' | 'actioned';
  assignedAgency?: string;
}

export interface ProjectCufData {
  landAcquisitionPct: number;
  contractorCapacity: number; // 0 - 100
  clearanceStatus: 'Pending Forest Clearance' | 'Environmental Cleared' | 'Railway Right-of-Way Pending' | 'All Clearances Granted' | 'State Nodal Bottleneck';
  fundingAvailability: 'Fully Allocated' | 'Partial Disbursal Gap' | 'Quarterly Trench Pending' | 'Constrained';
  resourceDeployment: 'Optimal' | 'Sub-optimal (-18%)' | 'Severe Deficit (-35%)';
}

export interface Project {
  id: string; // e.g. "PRJ-602096"
  name: string;
  code: string;
  sector: string;
  ministry: string;
  state: string;
  district?: string;
  implementingAgency: string;
  status: 'Ongoing' | 'Delayed' | 'Critical Review' | 'Near Completion';
  
  // Financials (₹ in Crores)
  originalCost: number;
  revisedCost: number;
  expenditure: number;
  predictedFinalCost: number;
  costOverrunProbability: number; // e.g. 82%
  costEscalationAmount: number; // predicted - revised

  // Schedule & Physical Progress
  originalCompletionDate: string; // e.g. "Dec 2024"
  revisedCompletionDate: string; // e.g. "Aug 2025"
  aiPredictedCompletionDate: string; // e.g. "May 2026"
  expectedDelayMonths: number; // e.g. 8.4
  scheduleDelayProbability: number; // e.g. 91%
  physicalProgress: number; // e.g. 58%
  expectedProgress: number; // e.g. 73%
  progressGap: number; // e.g. 15%
  
  // AI Risk Assessment
  riskScore: number; // e.g. 87
  riskLevel: RiskLevel;
  riskTrend: 'worsening' | 'stable' | 'improving';
  confidenceScore: number; // e.g. 94%
  mainRiskReason: string;

  // Geospatial
  lat: number;
  lng: number;

  // Deep Intelligence
  monthlyHistory: MonthlyProgressPoint[];
  shapContributors: ShapContributor[];
  interventions: RecommendedIntervention[];
  cuf: ProjectCufData;
  tags: string[];
}

export interface EarlyWarningAlert {
  id: string;
  projectId: string;
  projectName: string;
  sector: string;
  ministry: string;
  state: string;
  severity: 'critical' | 'high' | 'medium' | 'resolved';
  warningTitle: string;
  riskChangeText: string;
  riskChangeValue: { from: number; to: number };
  aiExplanation: string;
  timestamp: string;
  responsibleAgency: string;
  recommendedAction: string;
  status: 'active' | 'reviewed' | 'escalated' | 'resolved';
  assignedOfficer?: string;
}

export interface NationalSummaryMetrics {
  reportingMonth: string;
  totalProjects: number;
  originalCostTotalLakhCr: number;
  revisedCostTotalLakhCr: number;
  cumulativeExpenditureLakhCr: number;
  criticalRiskProjectsCount: number;
  predictedDelayProjectsCount: number;
  costRiskProjectsCount: number;
  portfolioHealthScore: number;
  portfolioHealthStatus: 'Healthy' | 'Needs Attention' | 'Critical Concern';
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  topRiskDrivers: {
    driver: string;
    percentage: number;
    count: number;
  }[];
}

export interface SimulationParams {
  physicalProgress: number;
  monthlyProgressRate: number; // %/mo
  fundingAvailability: number; // 0 - 100
  contractorCapacity: number; // 0 - 100
  landAcquisitionPct: number; // 0 - 100
  clearanceSpeed: number; // 0 - 100
  resourceDeployment: number; // 0 - 100
}

export interface SimulationResult {
  baselineRiskScore: number;
  simulatedRiskScore: number;
  riskReductionPoints: number;
  baselineDelayProbability: number;
  simulatedDelayProbability: number;
  baselineCostRisk: number;
  simulatedCostRisk: number;
  expectedDelayReductionMonths: number;
  confidence: string;
}

export interface ModelMetricRow {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  trainingTimeSec: number;
  isBest?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  referencedProjectIds?: string[];
  suggestedActions?: string[];
  metricsTable?: { label: string; value: string; note?: string }[];
  confidence?: 'High (94%)' | 'Moderate (81%)' | 'Preliminary (68%)';
}

export type ActiveNavRoute =
  | 'dashboard'
  | 'projects'
  | 'project-detail'
  | 'risk-monitor'
  | 'alerts'
  | 'analytics'
  | 'benchmarking'
  | 'map'
  | 'simulator'
  | 'assistant'
  | 'reports'
  | 'data'
  | 'model-performance'
  | 'admin'
  | 'landing'
  | 'login';
