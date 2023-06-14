import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Pages/login/login.component';
import { CreateQuestionComponent } from './Pages/create-question/create-question.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { AnswerQuestionComponent } from './Pages/answer-question/answer-question.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-question', component: CreateQuestionComponent },
  { path: 'question/:id', component: AnswerQuestionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
