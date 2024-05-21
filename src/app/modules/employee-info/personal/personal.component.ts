import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { EmployeeNavbarComponent } from '../employee-navbar/employee-navbar.component';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    EmployeeNavbarComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgSelectModule
  ],
  templateUrl: './personal.component.html',
  providers:[DatePipe],
  styleUrl: './personal.component.css',
})
export class PersonalComponent implements OnInit {
  encrptedUserId: any;
  encrptedUsername: any;
  userId: string = '';
  username: string = '';
  employeeInfo: any;
  date: any;
  photoPreview!: string;
  primaryContact: any;
  fileSizeError: boolean = false;
  expanded: { [key: string]: boolean } = {};
  errorMessage: string = '';
  dateFormate: any;

  @ViewChild('accordion') accordion!: ElementRef;

  toggleAccordion(id: string) {
    const accordionItem = this.accordion.nativeElement.querySelector(`#${id}`);
    accordionItem.classList.toggle('show');
    this.expanded[id] = !this.expanded[id];
  }

  constructor(
    private auth: AuthService,
    private ed: EncryptingDecryptingService,
    private fb: FormBuilder,
    private route: Router,
    private datePipe: DatePipe,
    private employeeService: EmployeeService
  ) {

  }

  // employeeData:any
  ngOnInit(): void {
    this.encrptedUserId = sessionStorage.getItem('userId');
    this.encrptedUsername = sessionStorage.getItem('username');
    this.username = this.ed.decrypt(this.encrptedUsername);
    this.userId = this.ed.decrypt(this.encrptedUserId);
    this.updateForm.get('Location.Pincode')?.valueChanges.subscribe(value => {
      if (this.updateForm.get('Location.Pincode')?.valid) {
        this.onPostalCodeChange(value);
      }
    });
    this.auth.getEmployeeInfo(this.userId)
      .subscribe(
        data => {
          if (data) {
            this.photoPreview = data.Photo;
            this.employeeInfo = this.transformDates(data);
            this.dateFormate = this.transformDateFormate(this.employeeInfo);
            this.updateForm.patchValue(this.employeeInfo);
          }
        }
      );
  }

  transformDates(employeeData:any){
    const transformDate = {...employeeData}
    transformDate.dob = this.datePipe.transform(transformDate.dob, 'yyyy-MM-dd');
    transformDate.doj = this.datePipe.transform(transformDate.doj, 'yyyy-MM-dd');
    // transformDate.doc = this.datePipe.transform(transformDate.doc, 'dd-MM-yyyy');
    return transformDate;
  }
  transformDateFormate(transformDates: any){
    const transformDate = {...transformDates}
    transformDate.dob = this.datePipe.transform(transformDate.dob, 'dd-MM-yyyy');
    transformDate.doj = this.datePipe.transform(transformDate.doj, 'dd-MM-yyyy');
    return transformDate
  }

  updateForm = this.fb.group({
    FirstName: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator],
    ],
    MiddleName: [''],
    LastName: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator],
    ],
    EmployeeCode: [''],
    Photo: [''],
    Gender: ['', [Validators.required]],
    Contact: this.fb.group({
      CountryCode: ['', [Validators.required]],
      Primary: ['', [Validators.required]],
      Emergency: ['', [Validators.required]],
    }),
    Email: this.fb.group({
      CompanyMail: [''],
      PersonalMail: ['', [Validators.required, Validators.email]],
    }),
    Location: this.fb.group({
      Flat: ['', [Validators.required]],
      Area: ['', [Validators.required]],
      Landmark: ['', [Validators.required]],
      Pincode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$|^\d{6}$/)]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
    }),
    dob: ['', [Validators.required]],
    doj: ['', [Validators.required]],
    doc: ['', [Validators.required]],
    SkillSet: this.fb.group({
      EmployeeSkillsetId: ['', [Validators.required]],
      PrimarySkillset: ['', [Validators.required]],
      SecondarySkillset: ['', [Validators.required]],
      SkillLevel: ['', [Validators.required]],
      Experience: ['', [Validators.required]],
      Certification: this.fb.group({
        CertificationName: ['', [Validators.required]],
        CertificationDate: ['', [Validators.required]],
      }),
    }),
    ManagerId: ['', [Validators.required]],
    Designation: ['', [Validators.required]],
  });

  //validating names
  nameValidator(v: any) {
    let pattern = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    if (pattern.test(v.value)) {
      return null;
    } else {
      return { onlyAlfa: true };
    }
  }

  get primaryE164Number() {
    const primaryControl = this.updateForm.get('Contact.Primary');
    if (primaryControl && typeof primaryControl.value === 'object') {
      console.log('inside');

      return (primaryControl.value as unknown as { e164Number: string })
        .e164Number;
    }
    return this.updateForm.getRawValue().Contact.Primary;
  }
  get emergencyE164Number() {
    const primaryControl = this.updateForm.get('Contact.Emergency');
    if (primaryControl && typeof primaryControl.value === 'object') {
      return (primaryControl.value as unknown as { e164Number: string })
        .e164Number;
    }
    return this.updateForm.getRawValue().Contact.Emergency;
  }

  onFileChange(event: any) {
    const reader = new FileReader();    
    if (event.target.files && event.target.files.length) {
      // console.log(event.target.files[0].size);
      if(event.target.files[0].size < 10000){
        this.fileSizeError = false;
        const [file] = event.target.files;
        reader.readAsDataURL(file);
  
        reader.onload = () => {
          this.updateForm.patchValue({
            Photo: reader.result as string,
          });
        };
      }else{
        this.fileSizeError = true;
      }
    }
  }

  onPostalCodeChange(postalCode: any) {
    this.employeeService.getLocation(postalCode).subscribe(location => {
      if (location) {
        this.updateForm.patchValue({
          Location: {
            City: location.city,
            State: location.state
          }
        });
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Invalid postal code or postal code not found.';
      }
    });
  }

  updateEmployee() {
    this.updateForm.patchValue({
      Contact: {
        Primary: this.primaryE164Number,
        Emergency: this.emergencyE164Number
      }
    });
   
    console.log(this.updateForm.value);
    this.auth.updateEmployeeInfo(this.userId, this.username,this.updateForm.value)
    .subscribe(
      (result)=>{
        console.log("Respose: ",result);
        location.reload();
      },(error)=>{
        console.log(error);
      }
    )
  }

  //toggling of edit button
  editMode: boolean[] = [false, false, false];
  toggleEdit(index: number) {
    this.editMode[index] = !this.editMode[index];
  }
}
