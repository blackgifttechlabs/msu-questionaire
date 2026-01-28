
export enum Language {
  ENGLISH = 'English'
}

export enum Section {
  INTRO = 'Introduction',
  PROFILE = 'Part A: Farmer Profile',
  TILLAGE = 'Part B1: Tillage Systems',
  NUTRIENTS = 'Part B2: Nutrient Management',
  SEEDS = 'Part B3: Seed Varieties',
  PERCEPTIONS = 'Part C: Perceptions',
  SUPPORT = 'Part D: Institutional Support',
  CONCLUSION = 'Part E: Conclusion'
}

export interface Question {
  id: string;
  section: Section;
  label: Record<Language, string>;
  type: 'select' | 'radio' | 'checkbox' | 'number' | 'text' | 'voice' | 'likert' | 'counter' | 'gender' | 'info';
  options?: { value: string; label: Record<Language, string> }[];
  condition?: (answers: Record<string, any>) => boolean;
}

export interface SurveyResponse {
  id: string;
  date: string;
  ward: string;
  enumerator: string;
  farmerId: string;
  answers: Record<string, any>;
  status: 'draft' | 'submitted';
}
