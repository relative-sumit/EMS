import { Component } from '@angular/core';
import { EmployeeNavbarComponent } from '../employee-navbar/employee-navbar.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [EmployeeNavbarComponent],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css'
})
export class AssetsComponent {

}
