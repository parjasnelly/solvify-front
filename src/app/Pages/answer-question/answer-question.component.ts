import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Problem } from 'src/app/Types/Problem';

interface SelectOptions {
  name: string;
  value: number | string;
}

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.sass'],
})
export class AnswerQuestionComponent {
  Subjects: SelectOptions[] = [
    { name: 'Matemática', value: 1 },
    { name: 'Português', value: 2 },
    { name: 'História', value: 3 },
    { name: 'Geografia', value: 4 },
    { name: 'Biologia', value: 5 },
    { name: 'Física', value: 6 },
    { name: 'Química', value: 7 },
    { name: 'Filosofia', value: 8 },
    { name: 'Sociologia', value: 9 },
    { name: 'Inglês', value: 10 },
    { name: 'Espanhol', value: 11 },
  ];

  question!: Problem;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.question = history.state;
  }
}
