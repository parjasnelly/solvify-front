export enum ProblemType {
  TRUEFALSE = 0,
  MULTITRUEFALSE,
  MULTICHOICE,
  MULTISELECT,
}

export interface ProblemRequestResponseObject {
  _id: string;
  problem_type: number;
  attempts: number;
  correct_answers: number;
  accuracy: number;
  upvotes: number;
  downvotes: number;
  feedback: string;
  subject_id: string;
  topic_id: string;
  subtopic_id: string;
  level_of_education: string;
  language: string;
  statement: string;
  creator_id: string;
  bool_answer?: boolean;
  items?: Array<string>;
  bool_answers?: Array<boolean>;
  correct_item?: number;
  correct_items?: Array<number>;
}

export interface Problem {
  id: string;
  problemType: ProblemType;
  attempts: number;
  correctAnswers: number;
  accuracy: number;
  upvotes: number;
  downvotes: number;
  feedback: string;
  subjectId: string;
  topicId: string;
  subtopicId: string;
  levelOfEducation: string;
  language: string;
  statement: string;
  creatorId: string;
  boolAnswer?: boolean;
  items?: Array<string>;
  boolAnswers?: Array<boolean>;
  correctItem?: number;
  correctItems?: Array<number>;
}

export interface ProblemAttemptResponseObject {
  _id: string;
  attempted_at: string;
  solution_accuracy: number;
  bool_response?: boolean;
  bool_responses?: Array<boolean>;
  item_response?: number;
  item_responses?: Array<number>;
}

export interface ProblemAttempt {
  user_id: string;
  problem_id: string;
  bool_response?: boolean;
  bool_answer?: boolean;
  item_response?: number;
  item_answer?: number;
  bool_responses?: Array<boolean>;
  bool_answers?: Array<boolean>;
  item_responses?: Array<number>;
  item_answers?: Array<number>;
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
