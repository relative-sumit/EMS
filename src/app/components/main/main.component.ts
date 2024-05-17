import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AdminSidebarComponent,
  SideNavToggle,
} from '../../modules/admin/admin-sidebar/admin-sidebar.component';
import { SideNavbarComponent } from '../../modules/employee/side-navbar/side-navbar.component';
import { BodyComponent } from '../body/body.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SideNavbarComponent,
    RouterOutlet,
    CommonModule,
    AdminSidebarComponent,
    BodyComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  userRole!: string;
  isSideNavCollapsed = true;
  screenWidth = 0;

  constructor(private auth: AuthService) {}
  ngOnInit(): void {}

  isloggedIn() {
    return this.auth.isLoggedin();
  }

  getRole() {
    // console.log("M",this.userRole);
    this.userRole = this.auth.getRole();

    return this.userRole === 'admin';
  }

  onToggleSidenav(data: SideNavToggle) {
    this.isSideNavCollapsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }
}
