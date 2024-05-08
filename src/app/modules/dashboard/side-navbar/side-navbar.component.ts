import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideNavbarComponentVariable } from '../../../global-variables/side-navbar-variables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faLaptop,
  faSitemap,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.css',
})
export class SideNavbarComponent {
  navbarListItem = [
    {
      number: 5,
      name: 'View my Info',
      icon: faUserGroup,
      link: 'employee-info',
    },
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
  ];
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
