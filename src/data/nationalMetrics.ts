import type { NationalSummaryMetrics } from '../types/project';

export const nationalSummaryMetrics: NationalSummaryMetrics = {
  reportingMonth: 'April 2026',
  totalProjects: 1981,
  originalCostTotalLakhCr: 37.13,
  revisedCostTotalLakhCr: 42.78,
  cumulativeExpenditureLakhCr: 20.36,
  criticalRiskProjectsCount: 184,
  predictedDelayProjectsCount: 613,
  costRiskProjectsCount: 381,
  portfolioHealthScore: 72,
  portfolioHealthStatus: 'Needs Attention',
  riskDistribution: {
    low: 894,
    medium: 562,
    high: 341,
    critical: 184
  },
  topRiskDrivers: [
    { driver: 'Land Acquisition & Right-of-Way', percentage: 27, count: 535 },
    { driver: 'Contractual & Contractor Liquidity Issues', percentage: 21, count: 416 },
    { driver: 'Clearance Delays (Forest / Eco / CRZ)', percentage: 16, count: 317 },
    { driver: 'Funding & Inter-Ministerial Disbursal Gaps', percentage: 14, count: 277 },
    { driver: 'Resource Constraints (Heavy Machinery / Labor)', percentage: 11, count: 218 },
    { driver: 'Scope Changes & Detailed Design Revisions', percentage: 7, count: 139 },
    { driver: 'Others (Geological, Extreme Weather, Local Litigation)', percentage: 4, count: 79 }
  ]
};

export const sectorSummaryList = [
  { sector: 'Roads & Highways', totalProjects: 842, criticalCount: 64, delayRiskAvg: 58, costGrowthPct: 14.2, budgetLakhCr: 12.8 },
  { sector: 'Railways', totalProjects: 374, criticalCount: 52, delayRiskAvg: 68, costGrowthPct: 22.4, budgetLakhCr: 11.2 },
  { sector: 'Petroleum & Natural Gas', totalProjects: 182, criticalCount: 18, delayRiskAvg: 41, costGrowthPct: 8.9, budgetLakhCr: 5.4 },
  { sector: 'Power & Renewable Energy', totalProjects: 245, criticalCount: 16, delayRiskAvg: 34, costGrowthPct: 6.2, budgetLakhCr: 6.1 },
  { sector: 'Urban Development & Metro', totalProjects: 162, criticalCount: 24, delayRiskAvg: 72, costGrowthPct: 26.8, budgetLakhCr: 4.8 },
  { sector: 'Ports, Shipping & Waterways', totalProjects: 98, criticalCount: 7, delayRiskAvg: 36, costGrowthPct: 7.1, budgetLakhCr: 1.6 },
  { sector: 'Civil Aviation', totalProjects: 48, criticalCount: 2, delayRiskAvg: 29, costGrowthPct: 5.0, budgetLakhCr: 0.7 },
  { sector: 'Telecommunications & Strategic', totalProjects: 30, criticalCount: 1, delayRiskAvg: 22, costGrowthPct: 3.8, budgetLakhCr: 0.18 }
];

export const ministrySummaryList = [
  { ministry: 'Ministry of Road Transport and Highways (MoRTH)', projects: 842, avgRisk: 59, critical: 64 },
  { ministry: 'Ministry of Railways (MoR)', projects: 374, avgRisk: 68, critical: 52 },
  { ministry: 'Ministry of Power', projects: 245, avgRisk: 42, critical: 16 },
  { ministry: 'Ministry of Petroleum and Natural Gas (MoPNG)', projects: 182, avgRisk: 47, critical: 18 },
  { ministry: 'Ministry of Housing and Urban Affairs (MoHUA)', projects: 162, avgRisk: 71, critical: 24 },
  { ministry: 'Ministry of Ports, Shipping and Waterways', projects: 98, avgRisk: 44, critical: 7 },
  { ministry: 'Ministry of Civil Aviation (MoCA)', projects: 48, avgRisk: 38, critical: 2 },
  { ministry: 'Ministry of Heavy Industries & Others', projects: 30, avgRisk: 31, critical: 1 }
];

export const stateRiskBreakdown = [
  { state: 'Maharashtra', projects: 214, avgRisk: 66, criticalCount: 28, delayRisk: 64 },
  { state: 'Uttar Pradesh', projects: 245, avgRisk: 61, criticalCount: 24, delayRisk: 59 },
  { state: 'Karnataka', projects: 142, avgRisk: 65, criticalCount: 19, delayRisk: 62 },
  { state: 'Uttarakhand', projects: 68, avgRisk: 74, criticalCount: 14, delayRisk: 76 },
  { state: 'Gujarat', projects: 188, avgRisk: 42, criticalCount: 9, delayRisk: 38 },
  { state: 'Tamil Nadu', projects: 135, avgRisk: 54, criticalCount: 12, delayRisk: 51 },
  { state: 'Odisha', projects: 112, avgRisk: 49, criticalCount: 10, delayRisk: 46 },
  { state: 'Jammu and Kashmir', projects: 45, avgRisk: 69, criticalCount: 8, delayRisk: 67 },
  { state: 'Bihar', projects: 164, avgRisk: 68, criticalCount: 21, delayRisk: 65 },
  { state: 'West Bengal', projects: 128, avgRisk: 63, criticalCount: 16, delayRisk: 60 },
  { state: 'Madhya Pradesh', projects: 156, avgRisk: 52, criticalCount: 11, delayRisk: 49 },
  { state: 'Rajasthan', projects: 174, avgRisk: 48, criticalCount: 10, delayRisk: 45 }
];
