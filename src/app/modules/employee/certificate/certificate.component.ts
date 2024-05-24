import { Component, OnInit } from '@angular/core';
import { GoalsService } from '../../../services/goals.service';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css',
})
export class CertificateComponent implements OnInit {
goalList: any[] = []

  constructor(
    private goal: GoalsService,
    private ed: EncryptingDecryptingService
  ) {}
  ngOnInit(): void {
    const userId = this.ed.decrypt('' + sessionStorage.getItem('userId'));
    this.goal.getOnlyCompletedCertificateGoals(userId).subscribe((data)=>{
      console.log(data)
      this.goalList = data
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? '0' + day : day.toString();
    const formattedMonth = month < 10 ? '0' + month : month.toString();

    return `${formattedDay}-${formattedMonth}-${year}`;
  }
}
