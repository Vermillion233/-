
export interface ProjectOverview {
  projectName: string;
  location: string;
  duration: string;
  description: string;
}

export interface RiskItem {
  workType: string;
  riskFactor: string;
  riskLevel: '상' | '중' | '하';
  safetyMeasure: string;
}

export interface AssessmentResult {
  projectOverview: ProjectOverview;
  items: RiskItem[];
  generatedAt: string;
}

export type AppStep = 'OVERVIEW' | 'WORK_TYPE' | 'ANALYZING' | 'RESULT';
