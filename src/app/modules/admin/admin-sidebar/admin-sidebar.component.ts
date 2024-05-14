import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faHome,
  faLaptop,
  faPowerOff,
  faSitemap,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  faBars = faBars;
  faPowerOff = faPowerOff;

  @Output() collapsedChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  collapsed = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedChanged.emit(this.collapsed);
  }

  navbarListItem = [
    {
      number: 1,
      name: 'Home',
      icon: faHome,
      link: '/dashboard/',
    },
    {
      number: 2,
      name: 'Team Management',
      icon: faUserGroup,
      link: 'dashboard/team-management',
    },
    {
      number: 3,
      name: 'Organisation Structure',
      icon: faSitemap,
      link: 'dashboard/org-structure',
    },
    {
      number: 4,
      name: 'Asset Details',
      icon: faLaptop,
      link: 'dashboard/asset-details',
    },
    {
      number: 5,
      name: 'Permission',
      icon: faLaptop,
      link: 'admin/create-permission',
    },
    {
      number: 6,
      name: 'Role',
      icon: faLaptop,
      link: 'admin/create-role',
    },
  ];
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}