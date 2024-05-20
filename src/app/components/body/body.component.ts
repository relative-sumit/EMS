import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
})
export class BodyComponent {
  @Input() collapsed = true;
  @Input() screenWidth = 0;

  constructor(private auth: AuthService) {}

  getBodyClass(): string {
    let styleClass = '';

    if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen';
    } else if (this.collapsed) {
      styleClass = 'body-trimmed';
    } else {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }

  isLoggedIn() {
    return this.auth.isLoggedin();
  }
}
