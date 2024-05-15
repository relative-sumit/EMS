import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-update-employee',
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
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})
export class UpdateEmployeeComponent implements OnInit{

  constructor(private fb: FormBuilder, private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.employeeService.employeeInfo
    .subscribe(
      (data)=>{
        // console.log(data);
        this.updateForm.patchValue(data);
      }
    )
  }

  updateForm = this.fb.group({
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
  getSelectedPrimarySkills(){}
  getRemainingPrimarySkills(){}
  getSelectedSecondarySkills(){}
  getRemainingSecondarySkills(){}
  updateEmployee(){
    console.log(this.updateForm.value)
  }
}
