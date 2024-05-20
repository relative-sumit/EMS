import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faHome,
  faLaptop,
  faPowerOff,
  faSitemap,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-navbar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './employee-navbar.component.html',
  styleUrl: './employee-navbar.component.css'
})
export class EmployeeNavbarComponent {
  faBars = faBars;
  faPowerOff = faPowerOff;



  navbarListItem = [
    {
      number: 1,
      name: 'Personal',
      icon: faHome,
      link: '/employee-info/personal',
    },
    {
      number: 2,
      name: 'Skill Set',
      icon: faUserGroup,
      link: 'employee-info/skillset',
    },
    {
      number: 3,
      name: 'Assets',
      icon: faSitemap,
      link: 'employee-info/assets',
    },
  ];

  activeItem: string= 'Personal';
  constructor(){
    this.activeItem = sessionStorage.getItem('activeItem') || 'profile';
    if (!sessionStorage.getItem('activeItem')) {
      sessionStorage.setItem('activeItem', 'profile');
    }
  }
  setActiveItem(name: string) {
    this.activeItem = name;
    sessionStorage.setItem('activeItem', name);
  }
}
