import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SideNavbarComponent } from '../../modules/dashboard/side-navbar/side-navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SideNavbarComponent, RouterOutlet, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  collapsed = false;

  constructor(private auth: AuthService) {}

  isloggedIn() {
    return this.auth.isLoggedin();
  }

  onCollapsedChanged(collapsed: boolean) {
    this.collapsed = collapsed;
  }
}
