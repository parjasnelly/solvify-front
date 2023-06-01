import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(authService: AuthService,private router: Router) {
    authService.isLogged.subscribe((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        this.router.navigate(["/login"]);
      }
    })
  }

}
