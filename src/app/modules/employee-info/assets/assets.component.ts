import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeNavbarComponent } from '../employee-navbar/employee-navbar.component';
import { AuthService } from '../../../services/auth.service';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    EmployeeNavbarComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],

  templateUrl: './assets.component.html',
  styleUrl: './assets.component.css',
})
export class AssetsComponent implements OnInit{
  expanded: { [key: string]: boolean } = {};
  encrptedUserId: any;
  assetsInfo: any;
  userId: string = '';
  formateDate: any;
  @ViewChild('accordion') accordion!: ElementRef;

  toggleAccordion(id: string) {
    const accordionItem = this.accordion.nativeElement.querySelector(`#${id}`);
    accordionItem.classList.toggle('show');
  }

  constructor(
    private auth: AuthService,
    private ed: EncryptingDecryptingService,
    private fb: FormBuilder,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.encrptedUserId = sessionStorage.getItem('userId');
    this.userId = this.ed.decrypt(this.encrptedUserId);
    this.auth.getEmployeeInfo(this.userId).subscribe((data) => {
      if (data) {
        this.assetsInfo = data.Assets;
        console.log(data.Assets);
        
      }
    });
  }


}
