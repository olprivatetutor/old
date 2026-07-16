export interface AssessmentResultTranslation {
  language: string;
  title?: string;
  summary?: string;
  strengths?: string[];
  areas?: string[];
}

export interface AssessmentResult extends Record<string, unknown> {
  cefr_level: string;
  level?: string;
  score?: number | string;
  title?: string;
  summary?: string;
  strengths?: string[];
  areas?: string[];
  translations?: AssessmentResultTranslation[];
}

export interface StartAssessmentData {
  reply: string;
  result?: AssessmentResult;
}

export interface StartAssessmentResponse {
  success: boolean;
  data?: StartAssessmentData;
  message?: string;
}

export interface StartAssessmentParams {
  moduleId: string;
}

export interface SendAssessmentChatData {
  reply: string;
  result?: AssessmentResult;
}

export interface SendAssessmentChatResponse {
  success: boolean;
  data?: SendAssessmentChatData;
  message?: string;
}
