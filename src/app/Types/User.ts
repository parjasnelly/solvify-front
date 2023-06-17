export interface User {
  id: string;
  username: string;
  displayName: string;
  languages: Array<string>;
  createdProblems: Array<string>;
  createdLists: Array<string>;
}

export interface UserCreateRequestResponseObject {
  _id: string;
  email: string,
  username: string,
  display_name: string,
  languages: Array<string>,
  created_at: string,
  created_problems: Array<string>,
  created_lists: Array<string>,
  solve_later_problems: Array<string>,
  solve_later_lists: Array<string>
}
