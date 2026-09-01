import type { ModelMetricRow } from '../types/project';

export const modelComparisonTable: ModelMetricRow[] = [
  {
    modelName: 'XGBoost (Ensemble Gradient Boosted Trees)',
    accuracy: 0.912,
    precision: 0.894,
    recall: 0.881,
    f1Score: 0.887,
    rocAuc: 0.894,
    trainingTimeSec: 14.2,
    isBest: true
  },
  {
    modelName: 'LightGBM (Fast Histogram Trees)',
    accuracy: 0.901,
    precision: 0.885,
    recall: 0.872,
    f1Score: 0.878,
    rocAuc: 0.882,
    trainingTimeSec: 6.8
  },
  {
    modelName: 'Random Forest (1000 Estimators)',
    accuracy: 0.864,
    precision: 0.841,
    recall: 0.835,
    f1Score: 0.838,
    rocAuc: 0.843,
    trainingTimeSec: 28.5
  },
  {
    modelName: 'Logistic Regression (L2 Regularized Baseline)',
    accuracy: 0.778,
    precision: 0.742,
    recall: 0.728,
    f1Score: 0.735,
    rocAuc: 0.741,
    trainingTimeSec: 1.4
  }
];

export const featureEngineeringComparison = {
  cufOnly: {
    name: 'CUF (Common Utility Format) Variables Only',
    variablesCount: 14,
    accuracy: 0.784,
    precision: 0.751,
    recall: 0.772,
    f1Score: 0.761,
    rocAuc: 0.812,
    notes: 'Relies solely on basic reported cost, expenditure, and target dates.'
  },
  cufPlusAdditional: {
    name: 'CUF + PAIMANA Augmented Features (Recommended)',
    variablesCount: 42,
    accuracy: 0.912,
    precision: 0.894,
    recall: 0.881,
    f1Score: 0.887,
    rocAuc: 0.894,
    notes: 'Incorporates 3-month physical progress velocity, contractor liquidity stress, historical sector delay decay, and land acquisition velocity.'
  }
};

export const globalFeatureImportance = [
  { feature: '3-Month Physical Progress Stagnation Index', importance: 0.245, category: 'Velocity' },
  { feature: 'Expenditure-to-Physical Progress Divergence Gap', importance: 0.198, category: 'Financial' },
  { feature: 'Land Acquisition & RoW Handover % Ratio', importance: 0.162, category: 'Clearance' },
  { feature: 'Contractor Past Execution Capacity & Workload', importance: 0.134, category: 'Contractor' },
  { feature: 'Historical Sector Delay Multiplier', importance: 0.098, category: 'Historical' },
  { feature: 'Inter-Departmental Clearance Pendency Count', importance: 0.082, category: 'Clearance' },
  { feature: 'Monsoon / Geo-Climatic Vulnerability Score', importance: 0.051, category: 'Geospatial' },
  { feature: 'Original vs Revised Budget Escalation Ratio', importance: 0.030, category: 'Financial' }
];

export const dataQualityMetrics = {
  dataConfidenceScore: 96,
  completenessPct: 98.4,
  consistencyPct: 97.2,
  freshnessStatus: 'Updated 2.4 hours ago',
  totalRecordsProcessed: 1981,
  duplicateRecords: 0,
  missingMandatoryFields: 12,
  invalidDateResolutions: 3,
  costAnomaliesFlagged: 7
};
