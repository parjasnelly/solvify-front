import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  overlayVisible: boolean = false;

  toggle() {
    this.overlayVisible = !this.overlayVisible;
  }
}
