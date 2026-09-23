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

export type PreschoolDomain = 
  | 'nhan-thuc'        // Phát triển Nhận thức (Khám phá khoa học & Toán)
  | 'the-chat'         // Phát triển Thể chất (Vận động & Giác quan)
  | 'tham-my'          // Phát triển Thẩm mỹ (Màu sắc, Âm thanh & Nghệ thuật)
  | 'ngon-ngu'         // Phát triển Ngôn ngữ (Mô tả, Đặt câu hỏi)
  | 'tinh-cam-xa-hoi'; // Phát triển Tình cảm & Kỹ năng xã hội

export interface PreschoolExplorationData {
  domain: PreschoolDomain;
  domainLabel: string;
  ageGroup: '3 - 4 tuổi' | '4 - 5 tuổi' | '5 - 6 tuổi';
  materials: string[];
  teacherPrompt: string;
  variableTuning: {
    name: string;
    description: string;
    options: { label: string; outcome: string }[];
  };
  spatialLayout: {
    action: string;
    outcome: string;
  };
  gestureDynamics: {
    action: string;
    outcome: string;
  };
  whatIfChallenge: {
    question: string;
    discoveryOutcome: string;
    badgeName: string;
    badgeIcon?: string;
  };
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
  preschoolProfile?: PreschoolExplorationData;
}

