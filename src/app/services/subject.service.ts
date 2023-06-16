import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { Subject, SubjectResponseObject } from '../Types/Subject';
import { AddTopicObject, Topic, TopicResponseObject } from '../Types/Topic';
import { Observable, map } from 'rxjs';
const STANDARD_URL = 'http://localhost:8080/api';

@Injectable()
export class SubjectService {
  constructor(private http: HttpClient, private logService: LogService) {}

  getSubjects(): Observable<Subject[]> {
    return this.http
      .get<SubjectResponseObject[]>(`${STANDARD_URL}/subjects`)
      .pipe(
        map((data) => {
          return data.map((subject) => ({
            id: subject._id,
            name: subject.name,
            language: subject.language,
          }));
        })
      );
  }

  getSubjectTopics(subjectId: string): Observable<Topic[]> {
    return this.http
      .post<TopicResponseObject[]>(`${STANDARD_URL}/topics/list`, {
        subject_id: subjectId,
      })
      .pipe(
        map((data) => {
          return data === null
            ? []
            : data.map((topic) => ({
                id: topic._id,
                subjectId: topic.subject_id,
                name: topic.name,
              }));
        })
      );
  }

  addSubjectTopic(topic: AddTopicObject): Observable<Topic[]> {
    this.http
      .post<TopicResponseObject>(`${STANDARD_URL}/topics/create`, topic)
      .subscribe();

    return this.getSubjectTopics(topic.subject_id);
  }
}
