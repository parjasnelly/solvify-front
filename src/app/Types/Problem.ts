export enum ProblemType {
  TRUEFALSE = 0,
  MULTITRUEFALSE,
  MULTICHOICE,
  MULTISELECT,
}

export interface Problem {
  id: string;
  userId: string;
  subjectId: string;
  topicId: string;
  subtopicId: string;
  levelOfEducation: string;
  problemType: ProblemType;
}

export interface TrueFalse extends Problem {
  boolAnswer: boolean;
}

export interface MultiTrueFalse extends Problem {
  statements: Array<string>;
  boolAnswers: Array<boolean>;
}

export interface MultiChoice extends Problem {
  items: Array<string>;
  correctItem: number;
}

export interface MultiSelection extends Problem {
  items: Array<string>;
  correctItem: Array<number>;
}

export interface Attempt {
  isCorrrect: boolean;
  problemType: number;
}

export interface ProblemFormData {
  userId: string;
  subjectId: string;
  topicId: string;
  subtopicId: string;
  levelOfEducation: string;
  optionFields: Array<any>;
  title: string;
  statement?: string;
  feedback: string;
  language: string;
}

export interface CreateTrueFalseProblemEntity {
  creator_id: string;
  statement: string;
  feedback: string;
  language: string;
  level_of_education: string;
  subject_id: string;
  topic_id: string;
  subtopic_id: string;
  bool_answer: boolean;
}

export interface CreateMultiTrueFalseProblemEntity {
  creator_id: string;
  statement: string;
  items: Array<string>;
  bool_answers: Array<boolean>;
  feedback: string;
  language: string;
  level_of_education: string;
  subject_id: string;
  topic_id: string;
  subtopic_id: string;
}

export interface CreateMultiChoiceProblemEntity {
  creator_id: string;
  statement: string;
  items: Array<string>;
  correct_item: number;
  feedback: string;
  language: string;
  level_of_education: string;
  subject_id: string;
  topic_id: string;
  subtopic_id: string;
}

export interface CreateMultiSelectionProblemEntity {
  creator_id: string;
  statement: string;
  items: Array<string>;
  correct_items: Array<number>;
  feedback: string;
  language: string;
  level_of_education: string;
  subject_id: string;
  topic_id: string;
  subtopic_id: string;
}
