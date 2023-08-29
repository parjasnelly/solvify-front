import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { Subject, SubjectResponseObject } from '../Types/Subject';
import { AddTopicObject, Topic, TopicResponseObject } from '../Types/Topic';
import { Observable, map } from 'rxjs';
import { environment } from './../../environments/environment';

const STANDARD_URL = environment.apiUrl;

@Injectable()
export class SubjectService {
  private subjects: Subject[] = [];
  constructor(private http: HttpClient, private logService: LogService) {}

  fetchSubjects() {
    this.http
      .get<SubjectResponseObject[]>(`${STANDARD_URL}/subjects`)
      .subscribe((data) => {
        const result = data.map((subject) => ({
          id: subject._id,
          name: subject.name,
          language: subject.language,
        }));
        this.subjects = result;
        this.saveSubjectsToLocalstorage(result);
      });
  }

  getSubjects(): Subject[] {
    if (this.subjects.length === 0) {
      const subjects = localStorage.getItem('subjects');

      this.subjects = JSON.parse(subjects!);
    }
    return this.subjects;
  }

  private saveSubjectsToLocalstorage(subjects: Subject[]): void {
    localStorage.setItem('subjects', JSON.stringify(subjects));
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
