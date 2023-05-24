declare namespace Problem {
  export enum ProblemType {
    TRUEFALSE = 0,
    MULTITRUEFALSE,
    MULTICHOICE,
    MULTISELECT,
  }

  export interface Entity {
    userId: string;
    subjectId: string;
    topicId: string;
    subtopicId: string;
    levelOfEducation: string;
    problemType: ProblemType;
  }

  export interface TrueFalse extends Entity {
    boolAnswer: boolean;
  }

  export interface MultiTrueFalse extends Entity {
    statements: Array<string>;
    boolAnswers: Array<boolean>;
  }

  export interface MultiChoice extends Entity {
    items: Array<string>;
    correctItem: number;
  }

  export interface MultiSelection extends Entity {
    items: Array<string>;
    correctItem: Array<number>;
  }

  export interface Attempt {
    isCorrrect: boolean;
    problemType: number;
  }
}
