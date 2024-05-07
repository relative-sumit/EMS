import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideNavbarComponentVariable } from '../../../global-variables/side-navbar-variables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faLaptop, faSitemap, faUserGroup } from '@fortawesome/free-solid-svg-icons';

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
      number: 1,
      name: 'Home',
      icon: faHome,
      link: '',
    },
    {
      number: 2,
      name: 'Team Management',
      icon: faUserGroup,
      link: '',
    },
    {
      number: 3,
      name: 'Organisation Structure',
      icon: faSitemap,
      link: '',
    },
    {
      number: 4,
      name: 'Asset Details',
      icon: faLaptop,
      link: '',
    },
  ];
}
