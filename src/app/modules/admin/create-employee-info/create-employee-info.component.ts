import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { EmployeeService } from '../../../services/employee.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';

@Component({
  selector: 'app-create-employee-info',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatDatepickerModule,
    MatRadioModule,
    NgxIntlTelInputModule,
    NgSelectModule
  ],
  templateUrl: './create-employee-info.component.html',
  styleUrl: './create-employee-info.component.css'
})
export class CreateEmployeeInfoComponent {
  _id:String = '';
  fileSizeError: boolean = false;
  encryptedUserName: any;
  userName: String = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router,
    private ed: EncryptingDecryptingService
    ){}

  ngOnInit(): void {
    // this.employeeService.employeeInfo
    // .subscribe(
    //   (data)=>{
    //     console.log(data);
    //     this._id = data._id
    //     console.log(this._id);
    //     this.updateForm.patchValue(data);
    //   }
    // )
    this.encryptedUserName = sessionStorage.getItem('username');
    this.userName = this.ed.decrypt(this.encryptedUserName);
  }

  addForm = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(4), this.nameValidator]],
    MiddleName: ['', [Validators.required, Validators.minLength(4), this.nameValidator]],
    LastName: ['', [Validators.required, Validators.minLength(4), this.nameValidator]],
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
        CertificationDate: ['', [Validators.required]]
      })
    }),
    ManagerId: ['', [Validators.required]],
    Designation: ['', [Validators.required]],
  });

  nameValidator(v: any) {
    let pattern = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
    if (pattern.test(v.value)) {
      return null;
    } else {
      return { 'onlyAlfa': true }
    }
  }
 
  get primaryE164Number() {
    const primaryControl = this.addForm.get('Contact.Primary');
    if (primaryControl && typeof primaryControl.value === 'object') {
      return (primaryControl.value as unknown as { e164Number: string })
        .e164Number;
    }
    return this.addForm.getRawValue().Contact.Primary;
  }
  get emergencyE164Number() {
    const primaryControl = this.addForm.get('Contact.Emergency');
    if (primaryControl && typeof primaryControl.value === 'object') {
      return (primaryControl.value as unknown as { e164Number: string })
        .e164Number;
    }
    return this.addForm.getRawValue().Contact.Emergency;
  }


  onFileChange(event: any) {
    const reader = new FileReader();    
    if (event.target.files && event.target.files.length) {
      // console.log(event.target.files[0].size);
      if(event.target.files[0].size < 100000){
        this.fileSizeError = false;
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.addForm.patchValue({
            Photo: reader.result as string,
          });
        };
      }else{
        console.log("error ")
        this.fileSizeError = true;
      }
    }
  }

  SecondarySkills = ['C#', 'C++', 'Python', 'Java', 'Ruby', 'Angular', 'Graphql', 'Node js'];
  getSelectedPrimarySkills() {
    return this.addForm.get('SkillSet.PrimarySkillset')?.value;
  }
  getSelectedSecondarySkills() {
    return this.addForm.get('SkillSet.SecondarySkillset')?.value;
  }
  getRemainingPrimarySkills() {
    return this.SecondarySkills.filter(skill => !this.getSelectedPrimarySkills()?.includes(skill));
  }
  getRemainingSecondarySkills() {
    return this.SecondarySkills.filter(skill => !this.getSelectedSecondarySkills()?.includes(skill));
  }

  addEmployee(){
    this.addForm.patchValue({
      Contact: {
        Primary: this.primaryE164Number,
        Emergency: this.emergencyE164Number
      }
    });
    console.log(this.addForm.value);
    this.employeeService.createEmployeeInfo(this.userName, this.addForm.value)
    .subscribe(
      (data)=>{
        console.log(data);
        this.route.navigate(['admin/employee-manage']);
      },error=>{
        console.error(error);
      }
    )
  }
}
