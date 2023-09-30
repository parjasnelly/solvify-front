import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {LogService} from "./log.service";
import {map, Observable, throwError} from "rxjs";
import {ListRequestResponseObject, ProblemList} from "../Types/ProblemList";
import {AuthService} from "./auth.service";

const STANDARD_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ListService {
  lists: ProblemList[] = [];
  constructor(private http: HttpClient, private logService: LogService, private authService: AuthService) {
  }

  getLists(pageNumber: number,
           pageSize: number): Observable<ProblemList[]> {
    return this.http
      .get<ListRequestResponseObject[]>(
        `${STANDARD_URL}/problemlists?page_id=${pageNumber}&page_size=${pageSize}`
      ).pipe(
        map((data) => {
          return data === null
            ? []
            : data.map((list) => ({
              id: list._id,
              creatorId: list.creator_id,
              problemIds: list.problem_ids,
              description: list.description,
              createdAt: list.created_at,
              upvotes: list.upvotes,
              downvotes: list.downvotes,
            }));
        })
      );
  }

  getListById(listId: string): Observable<ProblemList> {
    return this.http
      .get<ListRequestResponseObject>(
        `${STANDARD_URL}/problemlists/${listId}`
      ).pipe(
        map((list) => ({
          id: list._id,
          creatorId: list.creator_id,
          problemIds: list.problem_ids,
          description: list.description,
          createdAt: list.created_at,
          upvotes: list.upvotes,
          downvotes: list.downvotes,
        }))
      );
  }

  createList(list: ProblemList): Observable<ProblemList> {
    return this.http
      .post<ListRequestResponseObject>(
        `${STANDARD_URL}/problemlists`,
        {
          creator_id: list.creatorId,
          problem_ids: list.problemIds,
          description: list.description,
          language: 'pt',
        }
      ).pipe(
        map((list) => ({
          id: list._id,
          creatorId: list.creator_id,
          problemIds: list.problem_ids,
          description: list.description,
          createdAt: list.created_at,
          upvotes: list.upvotes,
          downvotes: list.downvotes,
        }))
      );
  }

  deleteList(listId: string){
    return this.http
      .delete(
        `${STANDARD_URL}/problemlists/${listId}`
      );
  }

  filterListsByCreatorId(list: ProblemList[], userId:string): ProblemList[] {
    return list.filter((list) => list.creatorId === userId);
  }

  editList(list: ProblemList): Observable<ProblemList> {
    return this.http
      .post<ListRequestResponseObject>(
        `${STANDARD_URL}/problemlists/${list.id}`,
        {
          creator_id: list.creatorId,
          problem_ids: list.problemIds,
          description: list.description,
          language: 'pt',
        }
      ).pipe(
        map((list) => ({
          id: list._id,
          creatorId: list.creator_id,
          problemIds: list.problem_ids,
          description: list.description,
          createdAt: list.created_at,
          upvotes: list.upvotes,
          downvotes: list.downvotes,
        }))
      );
  }
}
