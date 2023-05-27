export interface User {
  id: string;
  username: string;
  displayName: string;
  languages: Array<string>;
  createdProblems: Array<string>;
  createdLists: Array<string>;
}
