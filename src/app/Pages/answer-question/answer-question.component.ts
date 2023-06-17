import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { ProblemService } from 'src/app/Services/question.service';
import { SubjectService } from 'src/app/Services/subject.service';
import {
  Problem,
  ProblemAttempt,
  ProblemAttemptResponseObject,
  ProblemType,
} from 'src/app/Types/Problem';
import { delay } from 'src/app/Utils/delay';
import { AuthService } from 'src/app/services/auth.service';

interface SelectOptions {
  name: string;
  value: number | string;
}

enum ResultType {
  INCORRECT = 0,
  HALF = 1,
  CORRECT = 2,
}

@Component({
  selector: 'app-answer-question',
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.sass'],
})
export class AnswerQuestionComponent {
  Subjects!: SelectOptions[];
  question!: Problem;
  answer!: boolean | FormGroup | string;
  answerResult: ResultType | null = null;
  isSubmissionLoading = false;
  isSubmitted = false;
  sendingReport = false;
  isReportModalVisible = false;
  reportText = '';

  get problemType(): typeof ProblemType {
    return ProblemType;
  }

  get answerResultType(): typeof ResultType {
    return ResultType;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private problemService: ProblemService,
    private authService: AuthService,
    private subjectService: SubjectService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.question = history.state;
    this.Subjects = this.subjectService
      .getSubjects()
      .map((subject) => ({ name: subject.name, value: subject.id }));

    if (this.question.problemType === ProblemType.TRUEFALSE) {
      this.answer = false;
    } else if (
      this.question.problemType === ProblemType.MULTITRUEFALSE ||
      this.question.problemType === ProblemType.MULTISELECT
    ) {
      this.answer = new FormGroup({
        itemAnswers: new FormArray(
          this.question.items!.map(() => new FormControl<boolean>(false))
        ),
      });
    } else {
      this.answer = '-1';
    }
  }

  get answerFormGroup() {
    return this.answer as FormGroup;
  }

  onReportButtonClick() {
    this.isReportModalVisible = true;
  }

  onVoteClick(upvote: boolean) {
    this.problemService
      .voteProblem(this.authService.userId, this.question.id, upvote)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sua Opinião foi registrada!',
            detail: 'Obrigado por nos ajudar a melhorar!',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao registrar sua opinião',
            detail: 'Tente novamente mais tarde!',
          });
        },
      });
  }

  getSubjectName(id: string) {
    if (this.Subjects === undefined) return 'Loading...';
    return this.Subjects.find((subject) => subject.value === id)?.name;
  }

  getSubjectIdByName(name: string) {
    if (this.Subjects === undefined) return null;
    return this.Subjects.find((subject) => subject.name === name)?.value;
  }

  onCheckboxChange(event: Event, index: number) {
    const element = event.target as HTMLInputElement;

    const selectedAnswers = this.answerFormGroup.controls[
      'itemAnswers'
    ] as FormArray;

    selectedAnswers.controls[index].setValue(element.checked);
  }

  isSubmitEnabled() {
    if (this.question.problemType === ProblemType.MULTICHOICE) {
      return this.answer === '-1';
    } else {
      return false;
    }
  }

  onSubmitSuccess(result: ProblemAttemptResponseObject) {
    this.answerResult = result.solution_accuracy;
    this.isSubmissionLoading = false;
    this.isSubmitted = true;

    this.messageService.add({
      severity:
        this.answerResult === ResultType.CORRECT
          ? 'success'
          : this.answerResult === ResultType.HALF
          ? 'warn'
          : 'error',
      summary: this.answerResult === ResultType.CORRECT ? 'Correto' : 'Errado',
      detail:
        this.answerResult === ResultType.CORRECT
          ? 'Parabens voce acertou! Continue assim!'
          : this.answerResult === ResultType.HALF
          ? 'Foi quase! Só uns detalhes mais por aprender!'
          : 'Que pena, voce errou! Mas nunca desista de aprender algo novo!',
    });
  }

  onSubmit() {
    this.isSubmissionLoading = true;

    const submissionAttempt: ProblemAttempt = {
      problem_id: this.question.id,
      user_id: this.authService.userId,
    };

    switch (this.question.problemType) {
      case ProblemType.TRUEFALSE:
        submissionAttempt.bool_response = this.answer as boolean;
        submissionAttempt.bool_answer = this.question.boolAnswer;
        this.problemService
          .answerProblem(submissionAttempt, this.question.problemType)
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      case ProblemType.MULTITRUEFALSE:
        submissionAttempt.bool_responses = (
          this.answer as FormGroup
        ).value.itemAnswers;
        submissionAttempt.bool_answers = this.question.boolAnswers;
        this.problemService
          .answerProblem(submissionAttempt, this.question.problemType)
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      case ProblemType.MULTICHOICE:
        submissionAttempt.item_response = parseInt(this.answer as string);
        submissionAttempt.correct_item = this.question.correctItem;
        this.problemService
          .answerProblem(submissionAttempt, this.question.problemType)
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      case ProblemType.MULTISELECT:
        submissionAttempt.item_responses = (
          this.answer as FormGroup
        ).value.itemAnswers;
        submissionAttempt.correct_items = this.question.correctItems;

        console.log(submissionAttempt.item_responses);
        this.problemService
          .answerProblem(submissionAttempt, this.question.problemType)
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      default:
        break;
    }
  }

  reportProblem() {
    this.sendingReport = true;

    this.problemService
      .reportProblem(
        this.question.id,
        this.authService.userId,
        this.reportText
      )
      .subscribe({
        next: () => {
          this.sendingReport = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Reportado com sucesso',
            detail: 'Obrigado por nos ajudar a melhorar!',
          });
          delay(2000).then(() => {
            this.router.navigate(['/']);
          });
        },
        error: (error) => {
          this.sendingReport = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao reportar',
            detail:
              'Ocorreu um erro ao reportar o problema, tente novamente mais tarde',
          });
          delay(2000).then(() => {
            this.router.navigate(['/']);
          });
        },
      });
  }
}
