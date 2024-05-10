import { Component } from '@angular/core';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private encrDcpr: EncryptingDecryptingService) {}
  checkRole() {
    const encrRole = '' + sessionStorage.getItem('role');
    const role = this.encrDcpr.decrypt(encrRole);
    return role === 'admin';
  }
}
