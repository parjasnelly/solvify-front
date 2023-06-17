import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/Services/question.service';
import { SubjectService } from 'src/app/Services/subject.service';
import { Problem } from 'src/app/Types/Problem';
import { Subject } from 'src/app/Types/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent {
  constructor(
    private problemService: ProblemService,
    private router: Router,
    private subjectService: SubjectService
  ) {}

  subject: Subject[] = [];
  questions: Problem[] = [];
  currentQuestionPage = 1;

  ngOnInit() {
    this.problemService
      .getProblems(this.currentQuestionPage, 20)
      .subscribe((data) => {
        data.forEach((question) => {
          const questionData =
            this.problemService.convertProblemResponseToProblem(question);
          this.questions.push(questionData);
        });

        this.currentQuestionPage++;
      });

    this.subject = this.subjectService.getSubjects();
  }

  getFilteredQuestions(id: string) {
    this.questions = [];
    this.currentQuestionPage = 1;

    this.problemService
      .getProblems(this.currentQuestionPage, 20, { subject_id: id })
      .subscribe((data) => {
        data.forEach((question) => {
          const questionData =
            this.problemService.convertProblemResponseToProblem(question);
          this.questions.push(questionData);
        });

        this.currentQuestionPage++;
      });
  }

  getAllQuestions() {
    this.questions = [];
    this.currentQuestionPage = 1;

    this.problemService
      .getProblems(this.currentQuestionPage, 20)
      .subscribe((data) => {
        data.forEach((question) => {
          const questionData =
            this.problemService.convertProblemResponseToProblem(question);
          this.questions.push(questionData);
        });

        this.currentQuestionPage++;
      });
  }

  goToQuestion(question: Problem) {
    this.router.navigateByUrl(`/question/${question.id}`, {
      state: question,
    });
  }

  getSubjectName(id: string) {
    if (this.subject === undefined) return 'Loading...';
    return this.subject.find((subject) => subject.id === id)?.name;
  }

  getMoreQuestions() {
    this.problemService
      .getProblems(this.currentQuestionPage, 20)
      .subscribe((data) => {
        data.forEach((question) => {
          const questionData =
            this.problemService.convertProblemResponseToProblem(question);
          this.questions.push(questionData);
        });

        this.currentQuestionPage++;
      });
  }
}
