export interface AttemptResponseObject {
  subject: string;
  statement: string;
  problem_id: string;
  attempted_at: string;
  solution_accuracy: number;
}

export interface Attempt {
  subject: string;
  statement: string;
  problemId: string;
  attemptedAt: string;
  solutionAccuracy: number;
}
