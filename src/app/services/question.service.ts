import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QuestionService {
  constructor(private http: HttpClient) {}
}
