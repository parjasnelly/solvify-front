import {Injectable, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  user = new SocialUser();
  loggedIn = localStorage.getItem('userObject')!=null && localStorage.getItem('userObject')!=undefined
  private isLoggedSource = new BehaviorSubject(this.loggedIn)
  isLogged= this.isLoggedSource.asObservable();

  constructor(private authService: SocialAuthService, private router: Router) {
    this.user = JSON.parse(localStorage.getItem('userObject') || '{}');
    this.authService.authState.subscribe((user) => {
      localStorage.setItem('userObject', JSON.stringify(user));
      this.user = user;
      this.loggedIn = (user != null);
      this.isLoggedSource.next(this.loggedIn);
      if (this.loggedIn){
        this.router.navigate(["/"]);
      }
    });
  }


  signOut(): void {
    localStorage.removeItem('userObject');
    try{this.authService.signOut()} catch (e) {
      console.log(e);
    }
    this.isLoggedSource.next(false);
  }
  refreshGoogleToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}
