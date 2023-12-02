import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from 'src/app/Services/list.service';
import { ProblemService } from 'src/app/Services/question.service';
import { SubjectService } from 'src/app/Services/subject.service';
import { Problem } from 'src/app/Types/Problem';
import { ProblemList } from 'src/app/Types/ProblemList';
import { Subject } from 'src/app/Types/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent {
  constructor(
    private problemService: ProblemService,
    private listService: ListService,
    private router: Router,
    private subjectService: SubjectService
  ) {}

  subject: Subject[] = [];
  questions: Problem[] = [];
  lists: ProblemList[] = [];
  currentQuestionPage = 1;
  currentListPage = 1;

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

    this.listService.getLists(this.currentListPage, 20).subscribe((data) => {
      data.forEach((list) => {
        this.lists.push(list);
      });

      this.currentListPage++;
    });

    this.subject = this.subjectService.getSubjects().sort(this.compare);
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

  goToList(list: ProblemList) {
    this.router.navigateByUrl(`/list/${list.id}/play`);
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

  displayLists = false;
  displayQuestions = true;
  switchQuestionsLists() { 
    this.displayLists = !this.displayLists;
    this.displayQuestions = !this.displayQuestions;
  }

  truncate(str: string, length: number){
    if (str.length > length)
      return str.substring(0,length)+'...';
    else
      return str;
  }

  compare(a: Subject, b: Subject) {
    if ( a.name < b.name ){
      return -1;
    } else if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }
}
