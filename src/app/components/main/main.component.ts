import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../modules/admin/admin-sidebar/admin-sidebar.component';
import { SideNavbarComponent } from '../../modules/employee/side-navbar/side-navbar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    SideNavbarComponent,
    RouterOutlet,
    CommonModule,
    AdminSidebarComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  collapsed = false;
  userRole!: string;

  constructor(private auth: AuthService) {}
  ngOnInit(): void {
  }

  isloggedIn() {
    return this.auth.isLoggedin();
  }

  getRole() {
    // console.log("M",this.userRole);
    this.userRole = this.auth.getRole();
    
    return this.userRole === 'admin';
  }

  onCollapsedChanged(collapsed: boolean) {
    this.collapsed = collapsed;
  }
}
