export interface LearningPathTranslation {
  id?: string;
  language: string;
  topicScope?: string;
}

export interface LearningPathItemTranslation {
  id?: string;
  language: string;
  activity?: string;
  activities?: string[];
  title?: string;
  description?: string;
  topicScope?: string;
  grammar_focus?: string[];
}

export interface LearningPathItem {
  id: string;
  order: number;
  title: string;
  titleRomanized?: string;
  instruction?: string;
  description: string;
  descriptionRomanized?: string;
  objective: string;
  focus: string;
  type?: string;
  activity?: string;
  activityRomanized?: string;
  requiredTime?: number;
  topicScope?: string;
  topicScopeRomanized?: string;
  target?: string[];
  progress?: number;
  translations?: LearningPathItemTranslation[];
}

export interface LearningPath {
  id?: string;
  language?: string;
  level: string;
  score?: number;
  summary: string;
  items: LearningPathItem[];
  moduleId?: string;
  topicScope?: string;
  topicScopeRomanized?: string;
  totalSteps?: number;
  translations?: LearningPathTranslation[];
}

export interface GenerateLearningPathOptions {
  level?: string;
}

export interface GenerateLearningPathApiStep {
  id: string;
  order: number;
  activity: string;
  activity_romanized?: string;
  title: string;
  title_romanized?: string;
  description: string;
  description_romanized?: string;
  required_time: number;
  topic_scope: string;
  topic_scope_romanized?: string;
  target: string[];
  progress: number;
  translations?: Array<{
    id?: string;
    learning_path_step_id?: string;
    language?: string;
    activity?: string;
    activities?: string[];
    title?: string;
    description?: string;
    topic_scope?: string;
    grammar_focus?: string[];
  }>;
}

export interface GenerateLearningPathApiData {
  id: string;
  language: string;
  module_id: string;
  level: string;
  topic_scope: string;
  topic_scope_romanized?: string;
  steps: GenerateLearningPathApiStep[];
  total_steps: number;
  translations?: Array<{
    id?: string;
    learning_path_id?: string;
    language?: string;
    topic_scope?: string;
  }>;
}

export interface GenerateLearningPathApiResponse {
  success: boolean;
  data?: GenerateLearningPathApiData;
  message?: string;
}

export interface LearningAssessment {
  score?: number;
  summary?: string;
  strengths?: string[];
  areas?: string[];
}

export interface LearningListeningState {
  phase?: string;
  material_type?: string;
  paragraph?: string;
  questions_asked?: number;
  answers?: string[];
}

export interface StartLearningChatData {
  type: string;
  reply: string;
  paragraph?: string;
  question_number?: number;
  assessment?: LearningAssessment;
  listening_state?: LearningListeningState;
}

export interface StartLearningChatResponse {
  success: boolean;
  data?: StartLearningChatData;
  message?: string;
}

export type SendLearningChatResponse = StartLearningChatResponse;

export interface StartLearningChatParams {
  moduleId: string;
  level: string;
  currentStep: number;
  learningPathStepId?: string;
  learningPath: LearningPath;
}
