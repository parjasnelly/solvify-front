import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultType } from 'src/app/Types/Attempt';
import { Problem } from 'src/app/Types/Problem';
import { ProblemList } from 'src/app/Types/ProblemList';
interface ListProblem {
  data: Problem;
  status: ResultType | undefined;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
})
export class SidebarComponent {
  @Input() isExpanded: boolean = false;
  @Input() list!: ProblemList;
  @Input() questions: Array<ListProblem> = [];
  @Input() activeQuestion!: string;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeQuestion: EventEmitter<string> = new EventEmitter<string>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
  handleQuestionSelect = (questionId: string) =>
    this.changeQuestion.emit(questionId);

  get answerResultType(): typeof ResultType {
    return ResultType;
  }

  get activeQuestionStatus() {
    return this.questions.filter(
      (question) => question.data.id == this.activeQuestion
    )[0].status!;
  }
}
