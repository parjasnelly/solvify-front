export interface ProblemList {
  id: string;
  userId: string;
  problemids: Array<string>;
  description: string;
  upvotes: number;
  downvotes: number;
}
