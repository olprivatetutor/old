export interface SyllabusTranslation {
  id?: string;
  language: string;
  title?: string;
  description?: string;
  topic_scope?: string;
  activities?: string[];
  grammar_focus?: string[];
  topic_scope_terms?: string[];
}

export interface SyllabusModule {
  item_id: string;
  module_title: string;
  activities?: string[];
  description?: string;
  estimation_duration_minutes?: number;
  grammar_focus?: string[];
  mastery_threshold?: number;
  topics?: string[];
  topic_scope_terms?: string[];
  translations?: SyllabusTranslation[];
  vocabulary_load?: number;
  status?: string;
  order?: number;
}

export interface SyllabusUnit {
  unit_id: string;
  unit_title: string;
  items: SyllabusModule[];
  translations?: SyllabusTranslation[];
}

export interface SyllabusCatalog {
  id: string;
  grade: number;
  level: string;
  cefr: string;
  subject: string;
  language: SyllabusLanguage;
  curriculum: string;
  units: SyllabusUnit[];
  translations?: SyllabusTranslation[];
}

export type SyllabusLanguage = 'english' | 'arabic';

export interface GetSyllabusParams {
  language: SyllabusLanguage;
}

export interface GetSyllabusModulesParams {
  syllabusId: string;
  language: SyllabusLanguage;
}

export interface SyllabiApiModule {
  id?: string;
  syllabus_id?: string;
  language?: SyllabusLanguage;
  title?: string;
  description?: string;
  title_romanized?: string;
  description_romanized?: string;
  topic_scope?: string;
  topic_scope_romanized?: string;
  activities?: string[];
  activities_romanized?: string[];
  vocabulary_load?: number;
  grammar_focus?: string[];
  grammar_focus_romanized?: string[];
  topic_scope_terms?: string[];
  estimation_duration_minutes?: number;
  mastery_threshold?: number;
  status?: string;
  order?: number;
  translations?: SyllabusTranslation[];
}

export interface SyllabiApiData {
  id?: string;
  language?: SyllabusLanguage;
  title?: string;
  description?: string;
  title_romanized?: string;
  description_romanized?: string;
  class?: string;
  level?: string[] | string;
  icon: string;
  translations?: SyllabusTranslation[];
  modules?: SyllabiApiModule[];
}

export interface SyllabiApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

export interface SyllabusModulesApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}
