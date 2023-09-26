import { Injectable, OnInit } from '@angular/core';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LogService } from './log.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserCreateRequestResponseObject } from '../Types/User';
import { environment } from './../../environments/environment';

const STANDARD_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new SocialUser();
  userId = '';
  loggedIn =
    localStorage.getItem('userObject') != null &&
    localStorage.getItem('userObject') != undefined;
  private isLoggedSource = new BehaviorSubject(this.loggedIn);
  isLogged = this.isLoggedSource.asObservable();

  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private logService: LogService,
    private http: HttpClient
  ) {
    this.user = JSON.parse(localStorage.getItem('userObject') || '{}');
    if (this.user != null) {
      console.log(this.user);
      this.getUserbyEmail(this.user.email).subscribe((data) => {
        this.userId = data._id;
      });
    }
    this.authService.authState.subscribe((user) => {
      localStorage.setItem('userObject', JSON.stringify(user));
      this.user = user;
      this.loggedIn = user != null;
      this.isLoggedSource.next(this.loggedIn);
      this.checkEmailUnique(user.email).subscribe((data) => {
        if (data.is_unique) {
          this.createUser(user.id, user.email, user.name).subscribe((data) => {
            this.userId = data._id;
          });
        } else {
          this.getUserbyEmail(user.email).subscribe((data) => {
            this.userId = data._id;
          });
        }
      });
      if (this.loggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  createUser(
    username: string,
    email: string,
    display_name: string,
    languages?: string[]
  ): Observable<UserCreateRequestResponseObject> {
    const params = {
      username: username,
      email: email,
      display_name: display_name,
      languages: languages || ['pt'],
    };

    return this.http
      .post<UserCreateRequestResponseObject>(`${STANDARD_URL}/users`, params)
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('User created succesfully');
            this.userId = data._id;
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  getUserbyEmail(email: string): Observable<UserCreateRequestResponseObject> {
    const params = {
      email: email,
    };

    return this.http
      .post<UserCreateRequestResponseObject>(
        `${STANDARD_URL}/users/email`,
        params
      )
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('User fetched succesfully');
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  checkEmailUnique(email: string): Observable<any> {
    const params = {
      email: email,
    };

    return this.http
      .post<any>(`${STANDARD_URL}/users/check-email-unique`, params)
      .pipe(
        tap({
          next: (data) => {
            this.logService.writeLog('check-email-unique fetched succesfully');
          },
          error: (error) => {
            this.handleError(error);
          },
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  signOut(): void {
    localStorage.removeItem('userObject');
    try {
      this.authService.signOut();
    } catch (e) {
      console.log(e);
    }
    this.isLoggedSource.next(false);
  }
  refreshGoogleToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
