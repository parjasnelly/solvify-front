import { Component } from '@angular/core';
import { SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  constructor() {}
}
