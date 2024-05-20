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
import { EncryptingDecryptingService } from '../../services/encrypting-decrypting.service';

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
  isSideNavCollapsed = true;
  screenWidth = 0;

  constructor(
    private auth: AuthService,
    private encrDpcr: EncryptingDecryptingService
  ) {}
  ngOnInit(): void {}

  isloggedIn() {
    return this.auth.isLoggedin();
  }

  isAdmin() {
    const role = this.encrDpcr.decrypt('' + sessionStorage.getItem('role'));
    if (role === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  onToggleSidenav(data: SideNavToggle) {
    this.isSideNavCollapsed = data.collapsed;
    this.screenWidth = data.screenWidth;
  }
}
