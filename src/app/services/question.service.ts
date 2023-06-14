import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import {
  CreateMultiChoiceProblemEntity,
  CreateMultiSelectionProblemEntity,
  CreateMultiTrueFalseProblemEntity,
  CreateTrueFalseProblemEntity,
  Problem,
  ProblemFormData,
  ProblemRequestResponseObject,
} from '../Types/Problem';
import { LogService } from './log.service';

const STANDARD_URL = 'http://localhost:8080/api';

@Injectable()
export class ProblemService {
  constructor(private http: HttpClient, private logService: LogService) {}

  getProblems(
    pageNumber: number,
    pageSize: number
  ): Observable<ProblemRequestResponseObject[]> {
    return this.http
      .get<ProblemRequestResponseObject[]>(
        `${STANDARD_URL}/problems?page_id=${pageNumber}&page_size=${pageSize}`
      )
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('Problems fetched succesfully');
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  addTrueFalseProblem(problemData: ProblemFormData): Observable<Problem> {
    const trueFalseProblemdData: CreateTrueFalseProblemEntity = {
      creator_id: problemData.userId,
      statement: problemData.optionFields[0].statement,
      feedback: problemData.feedback,
      language: problemData.language,
      level_of_education: problemData.levelOfEducation,
      subject_id: problemData.subjectId,
      topic_id: problemData.topicId,
      subtopic_id: problemData.subtopicId,
      bool_answer: problemData.optionFields[0].answer,
    };

    return this.http
      .post<Problem>(`${STANDARD_URL}/problems/tf`, trueFalseProblemdData)
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('True False Problem Added succesfully');
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  addMultiTrueFalseProblem(problemData: ProblemFormData): Observable<Problem> {
    const multiTrueFalseProblemData: CreateMultiTrueFalseProblemEntity = {
      creator_id: problemData.userId,
      statement: problemData.statement!,
      items: problemData.optionFields.map((option) => option.statement),
      bool_answers: problemData.optionFields.map((option) => option.answer),
      feedback: problemData.feedback,
      language: problemData.language,
      level_of_education: problemData.levelOfEducation,
      subject_id: problemData.subjectId,
      topic_id: problemData.topicId,
      subtopic_id: '111111111',
    };

    return this.http
      .post<Problem>(`${STANDARD_URL}/problems/mtf`, multiTrueFalseProblemData)
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog(
              'Multi True False Problem Added succesfully'
            );
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  addMultiChoiceProblem(problemData: ProblemFormData): Observable<Problem> {
    const multiChoiceProblemData: CreateMultiChoiceProblemEntity = {
      creator_id: problemData.userId,
      statement: problemData.statement!,
      items: problemData.optionFields.map((option) => option.label),
      correct_item: problemData.optionFields.findIndex(
        (option) => option.isCorrect === true
      ),
      feedback: problemData.feedback,
      language: problemData.language,
      level_of_education: problemData.levelOfEducation,
      subject_id: problemData.subjectId,
      topic_id: problemData.topicId,
      subtopic_id: '111111111',
    };

    return this.http
      .post<Problem>(`${STANDARD_URL}/problems/mc`, multiChoiceProblemData)
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('Multi Choice Problem Added Succesfully');
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  addMultiSelectProblem(problemData: ProblemFormData): Observable<Problem> {
    const multiSelectProblemData: CreateMultiSelectionProblemEntity = {
      creator_id: problemData.userId,
      statement: problemData.statement!,
      items: problemData.optionFields.map((option) => option.label),
      correct_items: problemData.optionFields.map((option) => option.isCorrect),
      feedback: problemData.feedback,
      language: problemData.language,
      level_of_education: problemData.levelOfEducation,
      subject_id: problemData.subjectId,
      topic_id: problemData.topicId,
      subtopic_id: '111111111',
    };

    return this.http
      .post<Problem>(`${STANDARD_URL}/problems/ms`, multiSelectProblemData)
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('Multi Select Problem Added Succesfully');
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  convertProblemResponseToProblem(
    problemResponse: ProblemRequestResponseObject
  ) {
    const questionData: Problem = {
      id: problemResponse._id,
      accuracy: problemResponse.accuracy,
      attempts: problemResponse.attempts,
      correctAnswers: problemResponse.correct_answers,
      creatorId: problemResponse.creator_id,
      downvotes: problemResponse.downvotes,
      feedback: problemResponse.feedback,
      language: problemResponse.language,
      levelOfEducation: problemResponse.level_of_education,
      statement: problemResponse.statement,
      subjectId: problemResponse.subject_id,
      subtopicId: problemResponse.subtopic_id,
      topicId: problemResponse.topic_id,
      upvotes: problemResponse.upvotes,
      problemType: problemResponse.problem_type,
      boolAnswer: problemResponse.bool_answer,
      items: problemResponse.items,
      boolAnswers: problemResponse.bool_answers,
      correctItem: problemResponse.correct_item,
      correctItems: problemResponse.correct_items,
    };

    return questionData;
  }
}
