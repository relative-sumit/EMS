import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SideNavbarComponent } from '../../modules/dashboard/side-navbar/side-navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeNavbarComponent } from '../../modules/employee-info/employee-navbar/employee-navbar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [SideNavbarComponent, RouterOutlet, CommonModule, EmployeeNavbarComponent],
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
