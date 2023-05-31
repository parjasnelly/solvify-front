/// <reference path="./Types/Problem.ts" />
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './Pages/login/login.component';
import { HomeComponent } from './Pages/home/home.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { HeaderComponent } from './Components/header/header.component';
import { CreateQuestionComponent } from './Pages/create-question/create-question.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoQuestionTypeComponent } from './Pages/create-question/no-question-type/no-question-type.component';
import { TrueFalseTypeComponent } from './Pages/create-question/true-false-type/true-false-type.component';
import { MultiTrueFalseTypeComponent } from './Pages/create-question/multi-true-false-type/multi-true-false-type.component';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiChoiceTypeComponent } from './Pages/create-question/multi-choice-type/multi-choice-type.component';
import { MultiSelectTypeComponent } from './Pages/create-question/multi-select-type/multi-select-type.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    HeaderComponent,
    CreateQuestionComponent,
    NoQuestionTypeComponent,
    TrueFalseTypeComponent,
    MultiTrueFalseTypeComponent,
    MultiChoiceTypeComponent,
    MultiSelectTypeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    InputTextareaModule,
    ButtonModule,
    RadioButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
