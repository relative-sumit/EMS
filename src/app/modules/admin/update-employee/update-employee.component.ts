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
import { Router } from '@angular/router';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { MatSelectModule } from '@angular/material/select';
import { EnumValuesService } from '../../../services/enum-values.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { State, City } from 'country-state-city';


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
    NgSelectModule,
    MatSelectModule,
    NgMultiSelectDropDownModule
  ],
  templateUrl: './update-employee.component.html',
  styleUrl: './update-employee.component.css'
})
export class UpdateEmployeeComponent implements OnInit{
  _id:String = '';
  fileSizeError: boolean = false;
  encryptedUserName:any;
  userName: String = '';
  errorMessage: string = '';
  skillSet!: [string];
  designations!: [string];
  skillLevel!:[string];
  department!:[string];
  managerInfo: any[] = [];
  viewManager: any[] = [];
  managerId: any;
  setEmployeeCodeToManagerId!:string
  states: any[] = [];
  cities: any[] = [];
  selectedState!: string;
  selectedCity!: string;

  managerDropdownSettings = {
    singleSelection: true,
    idField: 'EmployeeCode',
    textField: 'view',
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No manager found',
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router ,
    private ed: EncryptingDecryptingService,
    private enumValues: EnumValuesService
    ){}

  ngOnInit(): void {
    this.encryptedUserName = sessionStorage.getItem('username');
    this.userName = this.ed.decrypt(this.encryptedUserName);
    // this.updateForm.get('Location.Pincode')?.valueChanges.subscribe(value => {
    //   if (this.updateForm.get('Location.Pincode')?.valid) {
    //     this.onPostalCodeChange(value);
    //   }
    // });
    this.states = State.getStatesOfCountry('IN');

    this.employeeService.employeeInfo
    .subscribe(
      (data)=>{
        console.log(data); 
        this._id = data._id
        // console.log(this._id);
        this.updateForm.patchValue(data);
        const selectedState = this.updateForm.get('Location.State')?.value;
        if (selectedState) {
          this.onStateChange(selectedState, data.Location.City);
        }
      }
    )
    this.enumValues.getAllEnumValues()
    .subscribe(
      data=>{
        this.skillSet = data.Skillset
        this.designations = data.Designation
        this.skillLevel = data.SkillLevel
        this.department = data.Department
      }
    )
    this.employeeService.getAllManagers().subscribe(
      data =>{
        data.forEach((item: any) => {
          const newObj = {
            FirstName: item.FirstName,
            LastName: item.LastName,
            EmployeeCode: item.EmployeeCode,
            view: item.FirstName + ' ' + item.LastName + ' - ' + item.EmployeeCode
          };
          this.managerInfo.push(newObj);
        });
        console.log(this.managerInfo);
        this.viewManager = this.managerInfo;
      },error=>{
        console.error(error);
      }
    )
  }

  updateForm = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator]],
    MiddleName: [''],
    LastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator]],
    EmployeeCode: [''],
    Photo: ['', [Validators.required]],
    Gender: ['', [Validators.required]],
    Contact: this.fb.group({
      CountryCode: [''],
      Primary: ['', [Validators.required]],
      Emergency: ['', [Validators.required]],
    }),
    Email: this.fb.group({
      CompanyMail: ['', [Validators.required, Validators.email, this.validEmail]],
      PersonalMail: ['', [Validators.required, Validators.email, this.validEmail]],
    }),
    Location: this.fb.group({
      Flat: ['', [Validators.required]],
      Area: ['', [Validators.required]],
      Landmark: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Pincode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$|^\d{6}$/)]],
    }),
    dob: ['', [Validators.required]],
    doj: ['', [Validators.required]],
    doc: ['', [Validators.required]],
    SkillSet: this.fb.group({
      EmployeeSkillsetId: [''],
      PrimarySkillset: ['', [Validators.required]],
      SecondarySkillset: [''],
      SkillLevel: ['', [Validators.required]],
      Experience: ['', [Validators.required, this.validExperience]],
      Certification: this.fb.group({
        CertificationName: [''],
        CertificationDate: ['']
      })
    }),
    ManagerId: [''],
    Department: this.fb.group({
      DepartmentName:['', [Validators.required]],
    }),
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
  validExperience(control: any) {
    const experience = control.value;
    if (!experience.match(/^(0|[1-9]|[1-2][0-9]|29)(\.[0-9]{1,2})? years?$/)) {
      return { invalidExperience: true };
    }
    return null;
  }
  validEmail(control: any) {
    const email = control.value;
    if (!email.match(/^(?!.*\.\..*)(?!.*\.{2,}@)[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // onPostalCodeChange(postalCode: any) {
  //   this.employeeService.getLocation(postalCode).subscribe(location => {
  //     if (location) {
  //       this.updateForm.patchValue({
  //         Location: {
  //           City: location.city,
  //           State: location.state
  //         }
  //       });
  //       this.errorMessage = '';
  //     } else {
  //       this.errorMessage = 'Invalid postal code or postal code not found.';
  //     }
  //   });
  // }

  getSelectedPrimarySkills() {
    return this.updateForm.get('SkillSet.PrimarySkillset')?.value;
  }
  getSelectedSecondarySkills() {
    return this.updateForm.get('SkillSet.SecondarySkillset')?.value;
  }
  // getRemainingPrimarySkills() {
  //   return this.skillSet.filter(skill => !this.getSelectedPrimarySkills()?.includes(skill));
  // }
  // getRemainingSecondarySkills() {
  //   return this.skillSet.filter(skill => !this.getSelectedSecondarySkills()?.includes(skill));
  // }

  // onStateChange() {
  //   const selectedState = this.updateForm.get('Location.State')?.value;
  //   this.cities = City.getCitiesOfState('IN', selectedState as any);
  //   this.updateForm.get('Location.City')?.setValue('');
  // }
  onStateChange(stateCode?: string, cityName?: string): void {
    const selectedState = stateCode || this.updateForm.get('Location.State')?.value;
    if (selectedState) {
      this.cities = City.getCitiesOfState('IN', selectedState);
      if (cityName) {
        this.updateForm.get('Location.City')?.setValue(cityName);
      } else {
        this.updateForm.get('Location.City')?.setValue('');
      }
    }
  }

  get primaryE164Number() {
    const primaryControl = this.updateForm.get('Contact.Primary');
    if (primaryControl && typeof primaryControl.value === 'object') {
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
      // if(event.target.files[0].size < 10000){
        this.fileSizeError = false;
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.updateForm.patchValue({
            Photo: reader.result as string,
          });
        };
      // }else{
      //   this.fileSizeError = true;
      // }
    }
  }

  updateEmployee(currentStepIndex: number){
    this.managerId = this.updateForm.value.ManagerId;
    if(this.managerId && this.managerId.length>0){
       this.setEmployeeCodeToManagerId = this.managerId[0].EmployeeCode
    }
    this.updateForm.patchValue({
      Contact: {
        Primary: this.primaryE164Number,
        Emergency: this.emergencyE164Number
      },
      ManagerId: this.setEmployeeCodeToManagerId,
    });
    
    // console.log("Step Index: ", currentStepIndex);
    console.log(this.updateForm.value);
    // const updateData = {...this.updateForm.value}
    // switch(currentStepIndex){
    //   case 0:
    //       updateData.FirstName = this.updateForm.get('FirstName')?.value,
    //       updateData.MiddleName = this.updateForm.get('MiddleName')?.value,
    //       updateData.LastName = this.updateForm.get('LastName')?.value,
    //       updateData.Department = this.updateForm.get('Department')?.value,
    //       updateData.Designation = this.updateForm.get('Designation')?.value,
    //       updateData.ManagerId = this.updateForm.get('ManagerId')?.value,
    //       updateData.doj = this.updateForm.get('doj')?.value,
    //       updateData.doc = this.updateForm.get('doc')?.value,
    //       updateData.Email = {
    //         CompanyMail: this.updateForm.get('Email.CompantMail')?.value
    //       }
          
    //     break;
    //   case 1:
    //   case 2 :
    // }
    // console.log("updated Data: ",updateData);
    // this.employeeService.updateEmployeeInfoById(this._id, this.userName, updateData)
    // .subscribe(
    //   (data)=>{
    //     console.log(data);
    //     this.route.navigate(['admin/employee-manage']);
    //   },error=>{
    //     console.error(error);
    //   }
    // )
  }
}
