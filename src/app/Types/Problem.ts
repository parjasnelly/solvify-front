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
