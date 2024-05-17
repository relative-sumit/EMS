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
  faClipboardCheck,
  faHome,
  faLaptop,
  faUserGroup,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';

export interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.css',
})
export class SideNavbarComponent implements OnInit{
  navbarListItem = [
    {
      number: 1,
      name: 'Home',
      icon: faHome,
      link: '/dashboard/',
    },
    {
      number: 2,
      name: 'Organisation Structure',
      icon: faUserGroup,
      link: 'admin/employee-manage',
    },
    {
      number: 3,
      name: 'Asset Management',
      icon: faLaptop,
      link: 'dashboard/asset-details',
    },
  ];

  encrptedUserId: any;
  userId: string = '';
  photoPreview!: string;
  name!: string;

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
    private ed: EncryptingDecryptingService
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.encrptedUserId = sessionStorage.getItem('userId');
    this.userId = this.ed.decrypt(this.encrptedUserId);
    this.auth.getEmployeeInfo(this.userId).subscribe((data) => {
      if (data) {
        this.photoPreview = data.Photo;
        this.name = data.FirstName;
      }
    });
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
