import {Component, OnInit} from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { SubjectService } from './Services/subject.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit{
  subjectService!: SubjectService;
  constructor(
    authService: AuthService,
    private router: Router,
    subjectService: SubjectService
  ) {
    this.subjectService = subjectService;
    authService.isLogged.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.subjectService.fetchSubjects();
  }
}
