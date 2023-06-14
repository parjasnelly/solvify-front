import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProblemService } from 'src/app/Services/question.service';
import { Problem } from 'src/app/Types/Problem';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent {
  constructor(private problemService: ProblemService, private router: Router) {}

  questions: Problem[] = [];
  currentQuestionPage = 1;

  ngOnInit() {
    this.problemService
      .getProblems(this.currentQuestionPage, 10)
      .subscribe((data) => {
        data.forEach((question) => {
          const questionData =
            this.problemService.convertProblemResponseToProblem(question);
          this.questions.push(questionData);
        });

        this.currentQuestionPage++;
      });
  }

  getMoreQuestions() {
    this.problemService
      .getProblems(this.currentQuestionPage, 10)
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
}
