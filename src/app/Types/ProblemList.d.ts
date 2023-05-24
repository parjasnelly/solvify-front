declare namespace ProblemList {
  export interface Entity {
    id: string;
    userId: string;
    problemids: Array<string>;
    description: string;
    upvotes: number;
    downvotes: number;
  }
}
