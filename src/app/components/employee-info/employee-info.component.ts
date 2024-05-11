import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EncryptingDecryptingService } from '../../services/encrypting-decrypting.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-info',
  standalone: true,
  imports: [],
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.css'
})
export class EmployeeInfoComponent {
  constructor(
    private decrpt: EncryptingDecryptingService,
    private authService: AuthService
  ){}
   encrptdUserId: any = '';
   employeeInfo: any;
  getId(){
    this.encrptdUserId =  sessionStorage.getItem('userId');
    const userId =  this.decrpt.decrypt(this.encrptdUserId)   
    this.authService.getEmployeeInfo(userId)
    .subscribe(
      (data)=>{
        console.log(data);
      },
      error=>{
        console.error(error);
      } 
    );
  }

  @Input() headerText: string = '';
  // @ViewChild('accordion') accordion!: ElementRef;

  // toggleAccordion(id: string) {
  //   const accordionItem = this.accordion.nativeElement.querySelector(`#${id}`);
  //   accordionItem.classList.toggle('show');
  // }
}
