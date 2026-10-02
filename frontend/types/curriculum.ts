export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ConceptDetail {
  id: string;
  name: string;
  description: string;
  masteryPct: number;
  status: 'Mastered' | 'Developing' | 'Weak' | 'Not Started';
  decayFactor?: number;
}

export interface KnowledgeCheckQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MiniPracticeTask {
  instruction: string;
  starterCode: string;
  solutionCode: string;
  expectedOutput: string;
  hints: string[];
}

export interface LessonDetail {
  id: string;
  moduleId: string;
  subjectId: string;
  courseId: string;
  lessonNumber: number;
  title: string;
  durationMinutes: number;
  isCompleted: boolean;
  learningObjectives: string[];
  conceptExplanation: string;
  intuition: string;
  visualExplanation: {
    diagramType: string;
    diagramTitle: string;
    asciiOrSvg: string;
    caption: string;
  };
  realWorldAnalogy: string;
  codeExample: {
    language: string;
    code: string;
    outputExplanation: string;
  };
  stepByStepWalkthrough: {
    step: number;
    title: string;
    detail: string;
  }[];
  commonMistakes: {
    mistake: string;
    whyItHappens: string;
    correctApproach: string;
  }[];
  miniPractice: MiniPracticeTask;
  aiTutorPrompts: {
    label: string;
    prompt: string;
    sampleResponse: string;
  }[];
  knowledgeCheck: KnowledgeCheckQuestion[];
  practicalChallenge: {
    title: string;
    scenario: string;
    task: string;
    deliverable: string;
  };
  masteryOutcome: {
    concept: string;
    targetMasteryDelta: number;
    skillCategory: string;
  };
}

export interface ModuleDetail {
  id: string;
  subjectId: string;
  moduleNumber: number;
  title: string;
  description: string;
  progressPct: number;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  assessmentStatus: 'Not Started' | 'In Progress' | 'Passed' | 'Mastered';
  masteryPct: number;
  concepts: string[];
  practiceProblemsCount: number;
  lessons: LessonDetail[];
}

export interface SubjectDetail {
  id: string;
  courseId: string;
  courseName: string;
  name: string;
  category: string;
  level: DifficultyLevel;
  progressPct: number;
  masteryPct: number;
  lessonsTotal: number;
  lessonsCompleted: number;
  problemsSolved: number;
  assessmentScore: number;
  confidencePct: number;
  retentionPct: number;
  lastStudied: string;
  nextRecommendedLesson: string;
  nextLessonId?: string;
  cognitiveGap?: string;
  prerequisites: string[];
  projectsConnected: string[];
  description: string;
  learningObjectives: string[];
  modules: ModuleDetail[];
}

export interface CourseDetail {
  id: string;
  courseNumber: string;
  title: string;
  shortDescription: string;
  domain: string;
  difficulty: DifficultyLevel;
  durationHours: number;
  subjectsCount: number;
  modulesCount: number;
  lessonsCount: number;
  progressPct: number;
  masteryPct: number;
  currentModule: string;
  skillOutcomes: string[];
  projectsCount: number;
  certificateStatus: 'Eligible' | 'In Progress' | 'Locked' | 'Verified';
  icon: string;
  isEnrolled: boolean;
  subjects: SubjectDetail[];
}

export interface TodayPlanTask {
  id: string;
  stepNumber: string;
  type: 'REVIEW' | 'LEARN' | 'PRACTICE' | 'BUILD' | 'ASSESS' | 'REFLECT';
  title: string;
  topic: string;
  estimatedMinutes: number;
  completed: boolean;
  targetHref: string;
  badge: string;
  aiRationale: string;
}

export interface RecommendedActionDetail {
  title: string;
  subject: string;
  module: string;
  whyThis: {
    prerequisiteNote: string;
    currentMasteryPct: number;
    detectedMisconception: string;
    requiredByUpcoming: string[];
    connectedProject: string;
    narrative: string;
  };
  estimatedMinutes: number;
  targetHref: string;
  actionLessonId: string;
}

export interface ProjectCurriculumItem {
  id: string;
  title: string;
  level: 'Level 1: Mini Project' | 'Level 2: Guided Project' | 'Level 3: Independent Project' | 'Level 4: Production Project' | 'Level 5: Portfolio Project' | 'Level 6: Industry Simulation';
  levelNumber: number;
  domain: string;
  problemStatement: string;
  requiredSkills: string[];
  prerequisites: string[];
  datasetInfo: string;
  expectedOutput: string;
  evaluationCriteria: string[];
  difficulty: DifficultyLevel;
  estimatedHours: number;
  deliverables: string[];
  githubEvidenceUrl: string;
  aiFeedbackSummary: string;
  skillEvidenceGenerated: string;
  status: 'Completed' | 'In Progress' | 'Locked';
  verifiedBadge?: string;
}

export interface IndustrySimulationItem {
  id: string;
  title: string;
  category: 'FinTech' | 'Healthcare' | 'E-Commerce' | 'Logistics' | 'Cloud' | 'Cybersecurity' | 'Education' | 'Agriculture' | 'Travel' | 'Manufacturing';
  businessContext: string;
  dataset: string;
  constraints: string[];
  requiredSkills: string[];
  expectedOutput: string;
  timeLimitMinutes: number;
  difficulty: DifficultyLevel;
  evaluationRubric: {
    correctnessWeight: number;
    codeQualityWeight: number;
    performanceWeight: number;
    reasoningWeight: number;
    edgeCasesWeight: number;
    architectureWeight: number;
    businessInterpretationWeight: number;
  };
  starterCode: string;
  hints: string[];
  completedStatus: 'Completed' | 'Ready to Solve' | 'Locked';
}

export interface AssessmentCenterItem {
  id: string;
  title: string;
  type: 'Diagnostic Assessment' | 'Lesson Quiz' | 'Module Assessment' | 'Subject Assessment' | 'Coding Assessment' | 'SQL Assessment' | 'ML Assessment' | 'System Design Assessment' | 'Industry Simulation' | 'Final Mastery Assessment';
  domain: string;
  score: number;
  accuracyPct: number;
  timeSpentMinutes: number;
  attemptsCount: number;
  weakAreas: string[];
  masteryChangePct: number;
  status: 'Passed' | 'Scheduled' | 'Available' | 'Needs Remediation';
  questionsCount: number;
}

export interface JudgeDemoStepItem {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  systemAction: string;
  telemetryEvidence: string;
  iconName: string;
  badge: string;
  color: string;
}
