export type LevelId = 'mam-non' | 'tieu-hoc' | 'thcs' | 'thpt';

export interface LevelInfo {
  id: LevelId;
  name: string;
  shortName: string;
  ageRange: string;
  badge: string;
  description: string;
  philosophy: string;
  bookSeries: string;
}

export interface Grade {
  id: string;
  name: string;
  levelId: LevelId;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  gradeId: string;
  icon: string;
  description: string;
}

export interface Chapter {
  id: string;
  title: string;
  subjectId: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  chapterId: string;
  order: number;
  firstPrinciples: {
    coreQuestion: string;
    intuition: string;
    whyItMatters: string;
  };
  summary: string[];
  keyFormulaLatex?: string;
  simulationId?: string;
}

export interface SimulationItem {
  id: string;
  title: string;
  levelId: LevelId;
  subjectName: string;
  gradeLabel: string;
  description: string;
  tags: string[];
  firstPrinciplesExplanation: string;
  mathLatex?: string;
  codeSnippet: string;
}

export interface InteractionPattern {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pedagogy: string;
  examples: string[];
  icon: string;
  accentColor: string;
}

export interface SimulationCatalogItem {
  stt: number;
  id: string;
  title: string;
  purpose: string;
  procedure: string[];
  extractedFrom: {
    subject: string;
    grade: string;
    lesson: string;
    textbook: string;
  };
  levelId: LevelId;
  interactionPatternId: string;
  interactionPatternName: string;
  hasLiveSim: boolean;
  liveSimId?: string;
  keyVariables?: string[];
  firstPrinciplesNote?: string;
}

