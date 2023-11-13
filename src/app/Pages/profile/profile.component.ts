import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProblemService } from 'src/app/Services/question.service';
import { SubjectService } from 'src/app/Services/subject.service';
import { Attempt } from 'src/app/Types/Attempt';
import { Problem, ProblemType } from 'src/app/Types/Problem';
import { Subject } from 'src/app/Types/Subject';
import { AuthService } from 'src/app/Services/auth.service';
import { ProblemList } from '../../Types/ProblemList';
import { ListService } from '../../Services/list.service';

enum ResultType {
  INCORRECT = 0,
  HALF = 1,
  CORRECT = 2,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
  providers: [ConfirmationService, MessageService],
})
export class ProfileComponent {
  lists: ProblemList[] = [];
  userProblems: Problem[] = [];
  userAttempts: Attempt[] = [];
  subjects: Subject[] = [];
  listsLoading = false;
  userProblemsLoading = false;
  attemptsLoading = false;

  activeTab: 'questions' | 'attempts' | 'lists' = 'questions';

  constructor(
    private authService: AuthService,
    private problemService: ProblemService,
    private messageService: MessageService,
    private subjectService: SubjectService,
    private listService: ListService,
    private confirmationService: ConfirmationService
  ) {}

  get user() {
    return this.authService.user;
  }

  get problemType(): typeof ProblemType {
    return ProblemType;
  }

  get resultType(): typeof ResultType {
    return ResultType;
  }

  ngOnInit(): void {
    this.attemptsLoading = true;
    this.userProblemsLoading = true;
    this.listsLoading = true;

    this.problemService
      .getProblems(1, 30, { authorId: this.authService.userId })
      .subscribe((problems) => {
        this.userProblems = problems.map((problem) =>
          this.problemService.convertProblemResponseToProblem(problem)
        );

        this.userProblemsLoading = false;
      });

    this.problemService
      .getAttemptsFromUser(this.authService.userId, 30, 1)
      .subscribe((attempts) => {
        this.userAttempts = attempts.map((attempt) => ({
          subject: attempt.subject,
          statement: attempt.statement,
          problemId: attempt.problem_id,
          attemptedAt: attempt.attempted_at,
          solutionAccuracy: attempt.solution_accuracy,
        }));

        this.attemptsLoading = false;
      });

    this.subjects = this.subjectService.getSubjects();
    this.listService.getLists(1, 30).subscribe((lists) => {
      this.lists = this.listService.filterListsByCreatorId(
        lists,
        this.authService.userId
      );

      this.listsLoading = false;
    });
  }

  getCorrectAttempts() {
    if (!this.userAttempts) return 0;
    return this.userAttempts.filter(
      (attempt) => attempt.solutionAccuracy === ResultType.CORRECT
    ).length;
  }

  getIncorrectAttempts() {
    if (!this.userAttempts) return 0;
    return this.userAttempts.filter(
      (attempt) => attempt.solutionAccuracy !== ResultType.CORRECT
    ).length;
  }

  onEditButtonClick() {
    this.messageService.add({
      severity: 'info',
      summary: 'Em Desenvolvimento',
      detail: 'Esta funcionalidade ainda não foi implementada.',
    });
  }

  getSubjectName(subjectId: string) {
    return this.subjects.find((subject) => subject.id === subjectId)?.name;
  }

  getProblemTypeName(problemType: ProblemType) {
    switch (problemType) {
      case ProblemType.MULTICHOICE:
        return 'Múltipla Escolha';
      case ProblemType.MULTISELECT:
        return 'Múltipla Seleção';
      case ProblemType.MULTITRUEFALSE:
        return 'Múltipla V ou F';
      case ProblemType.TRUEFALSE:
        return 'Verdadeiro ou Falso';
      default:
        return 'Desconhecido';
    }
  }

  getDateValue(date: string) {
    return new Date(date).toLocaleDateString('pt-br');
  }

  getResultTypeName(resultType: ResultType) {
    switch (resultType) {
      case ResultType.CORRECT:
        return 'Correto';
      case ResultType.HALF:
        return 'Parcial';
      case ResultType.INCORRECT:
        return 'Incorreto';
      default:
        return 'Desconhecido';
    }
  }

  onDeleteButtonClick(list: ProblemList) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a lista ${list.description}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.listService.deleteList(list.id!).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Lista excluida com sucesso',
            detail: `A lista foi deletada`,
          });
          this.listService.getLists(1, 30).subscribe((lists) => {
            this.lists = this.listService.filterListsByCreatorId(
              lists,
              this.authService.userId
            );
          });
        });
      },
    });
  }
}
