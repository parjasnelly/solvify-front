import {Problem} from "./Problem";

export interface ProblemList {
  id?: string;
  creatorId: string;
  problemIds: Array<string>;
  description: string;
  createdAt?: string;
  upvotes?: number;
  downvotes?: number;
}

export interface ListRequestResponseObject {
  _id: string;
  creator_id: string;
  problem_ids: string[];
  description: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
}
