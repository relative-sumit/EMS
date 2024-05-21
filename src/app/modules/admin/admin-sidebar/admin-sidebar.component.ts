import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faLaptop,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent implements OnInit {
  navbarListItem = [
    {
      number: 1,
      name: 'Home',
      icon: faHome,
      link: '/dashboard/',
    },
    {
      number: 2,
      name: 'Employee Management',
      icon: faUserGroup,
      link: 'admin/employee-manage',
    },
    {
      number: 3,
      name: 'Asset Management',
      icon: faLaptop,
      link: 'admin/asset-details',
    },
  ];


  collapsed = true;
  screenWidth = 0;
  @Output() onToggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSidenav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }
  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  logout() {
    this.auth.logout();
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggleSidenav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav() {
    this.collapsed = false;
    this.onToggleSidenav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }
}
