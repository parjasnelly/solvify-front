import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, delay } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { ListService } from 'src/app/Services/list.service';
import { ProblemService } from 'src/app/Services/question.service';
import { ResultType } from 'src/app/Types/Attempt';
import {
  Problem,
  ProblemAttempt,
  ProblemAttemptResponseObject,
  ProblemType,
} from 'src/app/Types/Problem';
import { ProblemList } from 'src/app/Types/ProblemList';

interface ListProblem {
  data: Problem;
  savedAnswer: boolean | boolean[] | string | undefined;
  status: ResultType | undefined;
  index: number;
}

@Component({
  selector: 'app-answer-list',
  templateUrl: './answer-list.component.html',
  styleUrls: ['./answer-list.component.sass'],
})
export class AnswerListComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private problemService: ProblemService,
    private authService: AuthService,
    private listService: ListService,
    private messageService: MessageService
  ) {}

  list!: ProblemList;
  sidebarExpanded: boolean = false;
  questions: Array<ListProblem> = [];
  private _activeQuestionId = new BehaviorSubject<string>('');
  loading: boolean = true;
  activeAnswer!: boolean | FormGroup | string;
  isSubmissionLoading = false;

  ngOnInit() {
    const listId = this.activatedRoute.snapshot.paramMap.get('id');

    this.listService.getListById(listId!).subscribe((data) => {
      this.list = data;

      data.problemIds.forEach((id, idx) => {
        this.problemService.getProblem(id).subscribe((data) => {
          this.questions.push({
            data: this.problemService.convertProblemResponseToProblem(data),
            savedAnswer: undefined,
            status: undefined,
            index: idx,
          });
        });
      });

      this._activeQuestionId.next(data.problemIds[0]);
      this.questions.sort((a, b) => a.index - b.index);
      this.loading = false;
    });

    this._activeQuestionId.subscribe((newValue) => {
      const foucusedQuestion = this.questions.find(
        (question) => question.data.id === newValue
      )!;

      if (foucusedQuestion.data.problemType === ProblemType.TRUEFALSE) {
        this.activeAnswer = foucusedQuestion.savedAnswer
          ? (foucusedQuestion.savedAnswer as boolean)
          : false;
      } else if (
        foucusedQuestion.data.problemType === ProblemType.MULTITRUEFALSE ||
        foucusedQuestion.data.problemType === ProblemType.MULTISELECT
      ) {
        const savedAnswer = foucusedQuestion.savedAnswer as boolean[];
        this.activeAnswer = new FormGroup({
          itemAnswers: new FormArray(
            savedAnswer
              ? savedAnswer.map((value) => {
                  return new FormControl<boolean>(value);
                })
              : foucusedQuestion.data.items!.map(
                  () => new FormControl<boolean>(false)
                )
          ),
        });
      } else {
        this.activeAnswer = foucusedQuestion.savedAnswer
          ? (foucusedQuestion.savedAnswer as string)
          : '-1';
      }
    });
  }

  get activeQuestionId() {
    return this._activeQuestionId.value;
  }

  get activeQuestion() {
    return this.questions.find(
      (question) => question.data.id == this.activeQuestionId
    )!;
  }

  getActiveAnswer(idx: number) {
    const answer = this.activeAnswer as FormGroup<{
      itemAnswers: FormArray<FormControl<boolean>>;
    }>;

    return answer.controls.itemAnswers.controls[idx].value;
  }

  get isListCompleted() {
    return this.questions.every((question) => question.status !== undefined);
  }

  get isListCorrect() {
    return this.questions.every(
      (question) => question.status === ResultType.CORRECT
    );
  }

  get answerResultType(): typeof ResultType {
    return ResultType;
  }

  get problemType(): typeof ProblemType {
    return ProblemType;
  }

  get answerFormGroup() {
    return this.activeAnswer as FormGroup;
  }

  updateActiveQuestion(newValue: string) {
    this._activeQuestionId.next(newValue);
  }

  onCheckboxChange(event: Event, index: number) {
    const element = event.target as HTMLInputElement;
    const selectedAnswers = this.answerFormGroup.controls[
      'itemAnswers'
    ] as FormArray;

    selectedAnswers.controls[index].setValue(element.checked);
  }

  onVoteClick(upvote: boolean) {
    this.problemService
      .voteProblem(this.authService.userId, this.activeQuestion.data.id, upvote)
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

  nextQuestion() {
    const index = this.questions.findIndex(
      (question) => question.data.id === this.activeQuestionId
    );

    if (!this.isListCompleted) {
      const nextUnansweredQuestionId = this.questions.find(
        (question) =>
          question.status === undefined &&
          question.data.id !== this.activeQuestionId
      )?.data.id;
      this._activeQuestionId.next(nextUnansweredQuestionId!);
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  isSubmitEnabled() {
    if (this.activeQuestion.data.problemType === ProblemType.MULTICHOICE) {
      return this.activeAnswer === '-1';
    } else {
      return false;
    }
  }

  onSubmitSuccess(result: ProblemAttemptResponseObject) {
    this.isSubmissionLoading = false;

    const questionIndex = this.questions.indexOf(this.activeQuestion);
    this.questions[questionIndex].status = result.solution_accuracy;

    this.messageService.add({
      severity:
        this.activeQuestion.status === ResultType.CORRECT
          ? 'success'
          : this.activeQuestion.status === ResultType.HALF
          ? 'warn'
          : 'error',
      summary:
        this.activeQuestion.status === ResultType.CORRECT
          ? 'Correto'
          : 'Errado',
      detail:
        this.activeQuestion.status === ResultType.CORRECT
          ? 'Parabens voce acertou! Continue assim!'
          : this.activeQuestion.status === ResultType.HALF
          ? 'Foi quase! Só uns detalhes mais por aprender!'
          : 'Que pena, voce errou! Mas nunca desista de aprender algo novo!',
    });

    if (this.isListCompleted) {
      delay(1000);
      this.messageService.add({
        severity: this.isListCorrect ? 'success' : 'warn',
        summary: 'Lista Completa!',
        detail: this.isListCorrect
          ? 'Parabens voce acertou todas as questões!'
          : 'Você errou algumas questões, mas não desista!',
      });
    }
  }

  onSubmit() {
    this.isSubmissionLoading = true;

    const submissionAttempt: ProblemAttempt = {
      problem_id: this.activeQuestionId,
      user_id: this.authService.userId,
    };

    switch (this.activeQuestion.data.problemType) {
      case ProblemType.TRUEFALSE:
        submissionAttempt.bool_response = this.activeAnswer as boolean;
        submissionAttempt.bool_answer = this.activeQuestion.data.boolAnswer;
        this.questions = this.questions.map((question) => {
          if (question.data.id === this.activeQuestionId) {
            return {
              ...question,
              savedAnswer: submissionAttempt.bool_response,
            };
          }
          return question;
        });

        this.problemService
          .answerProblem(
            submissionAttempt,
            this.activeQuestion.data.problemType
          )
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      case ProblemType.MULTITRUEFALSE:
        submissionAttempt.bool_responses = (
          this.activeAnswer as FormGroup
        ).value.itemAnswers;
        submissionAttempt.bool_answers = this.activeQuestion.data.boolAnswers;
        this.questions = this.questions.map((question) => {
          if (question.data.id === this.activeQuestionId) {
            return {
              ...question,
              savedAnswer: submissionAttempt.bool_responses,
            };
          }
          return question;
        });

        this.problemService
          .answerProblem(
            submissionAttempt,
            this.activeQuestion.data.problemType
          )
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      case ProblemType.MULTICHOICE:
        submissionAttempt.item_response = parseInt(this.activeAnswer as string);
        submissionAttempt.correct_item = this.activeQuestion.data.correctItem;
        this.questions = this.questions.map((question) => {
          if (question.data.id === this.activeQuestionId) {
            return {
              ...question,
              savedAnswer: this.activeAnswer as string,
            };
          }
          return question;
        });

        this.problemService
          .answerProblem(
            submissionAttempt,
            this.activeQuestion.data.problemType
          )
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      case ProblemType.MULTISELECT:
        submissionAttempt.item_responses = (
          this.activeAnswer as FormGroup
        ).value.itemAnswers;
        submissionAttempt.correct_items = this.activeQuestion.data.correctItems;
        this.questions = this.questions.map((question) => {
          if (question.data.id === this.activeQuestionId) {
            return {
              ...question,
              savedAnswer: submissionAttempt.item_responses,
            };
          }
          return question;
        });

        this.problemService
          .answerProblem(
            submissionAttempt,
            this.activeQuestion.data.problemType
          )
          .subscribe((result) => {
            this.onSubmitSuccess(result);
          });
        break;
      default:
        break;
    }
  }
}
