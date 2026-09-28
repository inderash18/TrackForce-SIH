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
  contribution: number; // e.g. +23% or pts
  direction: 'increase' | 'decrease' | 'increases_risk' | 'decreases_risk';
  explanation: string;
  category?: 'progress' | 'schedule' | 'financial' | 'historical' | 'milestone' | 'clearance' | string;
  feature?: string;
  impact?: number;
  description?: string;
}

export interface RecommendedIntervention {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  pillar?: string;
  reason?: string;
  description?: string;
  action?: string;
  expectedImpact: string;
  delayRiskBefore?: number;
  delayRiskAfter?: number;
  riskScoreBefore?: number;
  riskScoreAfter?: number;
  status?: 'suggested' | 'in-review' | 'actioned' | string;
  assignedAgency?: string;
}

export interface ProjectCufData {
  landAcquisitionPct: number;
  contractorCapacity: number; // 0 - 100
  clearanceStatus: string;
  forestClearance?: string;
  environmentClearance?: string;
  fundingAvailability: string;
  resourceDeployment: string;
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
  status: 'Ongoing' | 'Delayed' | 'Critical Review' | 'Near Completion' | 'In Progress' | 'Critical Delay' | 'On Track' | 'Completed' | string;
  
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
  riskLevel: RiskLevel | string;
  riskTrend?: 'worsening' | 'stable' | 'improving';
  confidenceScore?: number; // e.g. 94%
  mainRiskReason?: string;

  // Geospatial
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;

  // Deep Intelligence
  monthlyHistory: MonthlyProgressPoint[];
  shapContributors: ShapContributor[];
  interventions?: RecommendedIntervention[];
  recommendedInterventions?: RecommendedIntervention[];
  cuf: ProjectCufData;
  tags?: string[];
}

export interface EarlyWarningAlert {
  id: string;
  projectId: string;
  projectName: string;
  sector: string;
  ministry: string;
  state?: string;
  severity: 'critical' | 'high' | 'medium' | 'resolved' | string;
  warningTitle?: string;
  warningType?: string;
  reason?: string;
  riskChangeText?: string;
  riskChangeValue?: { from: number; to: number };
  aiExplanation?: string;
  timestamp: string;
  responsibleAgency?: string;
  responsibleTeam?: string;
  recommendedAction?: string;
  status: 'active' | 'reviewed' | 'escalated' | 'resolved' | 'Active' | 'In Review' | 'Resolved' | string;
  assignedOfficer?: string;
  assignedTo?: string;
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
  f1Score?: number;
  f1?: number;
  rocAuc: number;
  trainingTimeSec?: number;
  trainingTime?: string | number;
  status?: string;
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
  confidence?: 'High (94%)' | 'Moderate (81%)' | 'Preliminary (68%)' | string;
}

export type ActiveNavRoute =
  | 'landing'
  | 'public-dashboard'
  | 'project-monitoring'
  | 'performance-monitoring'
  | 'archive-project-monitoring'
  | 'archive-project-performance'
  | 'about-ipmd'
  | 'about-ocms'
  | 'about-vision'
  | 'orders-manuals'
  | 'media-gallery'
  | 'faq'
  | 'sitemap'
  | 'contact'
  | 'policies'
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
  | 'login';
