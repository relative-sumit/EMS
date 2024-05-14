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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    EmployeeNavbarComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
})
export class PersonalComponent implements OnInit {
  encrptedUserId: any;
  employeeInfo: any;
  date: any;
  userId: string = '';
  photoPreview!: string;
  primaryContact: any;

  @ViewChild('accordion') accordion!: ElementRef;

  toggleAccordion(id: string) {
    const accordionItem = this.accordion.nativeElement.querySelector(`#${id}`);
    accordionItem.classList.toggle('show');
  }

  constructor(
    private auth: AuthService,
    private ed: EncryptingDecryptingService,
    private fb: FormBuilder,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.encrptedUserId = sessionStorage.getItem('userId');
    this.userId = this.ed.decrypt(this.encrptedUserId);
    this.auth.getEmployeeInfo(this.userId).subscribe((data) => {
      if (data) {
        // console.log(data);
        this.photoPreview = data.Photo;
        this.updateForm.patchValue(data);
        const [month, day, year] = data.dob.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
          date
        );
        const updatedData = { ...data, dob: formattedDate }; // we can add doc doj as well
        this.employeeInfo = updatedData;
      }
    });
  }

  updateForm = this.fb.group({
    FirstName: [
      '',
      [Validators.required, Validators.minLength(4), this.nameValidator],
    ],
    MiddleName: [
      '',
      [Validators.required, Validators.minLength(4), this.nameValidator],
    ],
    LastName: [
      '',
      [Validators.required, Validators.minLength(4), this.nameValidator],
    ],
    EmployeeCode: [''],
    UserId: [''],
    Photo: [''],
    Gender: ['', [Validators.required]],
    Contact: this.fb.group({
      CountryCode: ['', [Validators.required]],
      Primary: ['', [Validators.required]],
      Emergency: ['', [Validators.required]],
    }),
    Email: this.fb.group({
      CompanyMail: [''],
      PersonalMail: ['', [Validators.required]],
    }),
    Location: this.fb.group({
      Flat: ['', [Validators.required]],
      Area: ['', [Validators.required]],
      Landmark: ['', [Validators.required]],
      Pincode: ['', [Validators.required]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
    }),
    dob: ['', [Validators.required]],
    doj: ['', [Validators.required]],
    doc: ['', [Validators.required]],
    Department: this.fb.group({
      DepartmentId: [''],
      DepartmentName: [''],
    }),
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

    console.log("Length:",event.target.files);
    
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.updateForm.patchValue({
          Photo: reader.result as string,
        });
      };
    }
  }

  updateEmployee() {
    this.updateForm.patchValue({
      Contact: {
        Primary: this.primaryE164Number,
        Emergency: this.emergencyE164Number,
      },
    });

    // console.log(this.updateForm.value);
    this.auth.updateEmployeeInfo(this.userId, this.updateForm.value).subscribe(
      (result) => {
        console.log('Respose: ', result);
        location.reload();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //toggling of edit button
  editMode: boolean[] = [false, false, false];
  toggleEdit(index: number) {
    this.editMode[index] = !this.editMode[index];
  }
}
