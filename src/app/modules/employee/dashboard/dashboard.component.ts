import { Component } from '@angular/core';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { HolidayComponent } from '../holiday/holiday.component';
import { CertificateComponent } from '../certificate/certificate.component';
import { OrgStructureComponent } from '../org-structure/org-structure.component';
import { QuickAccessComponent } from '../quick-access/quick-access.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HolidayComponent,
    CertificateComponent,
    OrgStructureComponent,
    QuickAccessComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private encrDcpr: EncryptingDecryptingService) {}
  checkRole() {
    const encrRole = '' + sessionStorage.getItem('role');
    const role = this.encrDcpr.decrypt(encrRole);
    return role === 'admin';
  }
}
