import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DisplayComponent } from '../display/display.component';
import { EmployeeService } from '../../../../services/employee.service';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EnumValuesService } from '../../../../services/enum-values.service';
import { Router } from '@angular/router';
import { EncryptingDecryptingService } from '../../../../services/encrypting-decrypting.service';
import { State, City } from 'country-state-city';

@Component({
  selector: 'app-profile',
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
    NgMultiSelectDropDownModule,
    DisplayComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
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
  teamLeadInfo: any[] = [];
  viewManager: any[] = [];
  viewTeamLead: any[] = [];
  managerId: any;
  setEmployeeCodeToManagerId!:string
  states: any[] = [];
  cities: any[] = [];
  selectedState!: string;
  selectedCity!: string;
  patchData: any;

  managerDropdownSettings = {
    singleSelection: true,
    idField: 'EmployeeCode',
    textField: 'view',
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No manager found',
  }
  teamLeadDropdownSettings = {
    singleSelection: true,
    idField: 'EmployeeCode',
    textField: 'view',
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No manager found',
  }

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private enumValues: EnumValuesService,
    private route: Router,
    private ed: EncryptingDecryptingService
  ){}

  ngOnInit(): void {
    this.encryptedUserName = sessionStorage.getItem('username');
    this.userName = this.ed.decrypt(this.encryptedUserName);
    this.states = State.getStatesOfCountry('IN');
    this.employeeService.employeeInfo
    .subscribe(
      (data)=>{
        console.log(data); 
        this._id = data._id
        // console.log(this._id);
        this.patchData = data ;
        
        if (this.patchData.ManagerId) {
          const managerView = `${this.patchData.ManagerId.FirstName} ${this.patchData.ManagerId.LastName} - ${this.patchData.ManagerId.EmployeeCode}`;
          const teamLeadView =  `${this.patchData.TeamLead.FirstName} ${this.patchData.TeamLead.LastName} - ${this.patchData.TeamLead.EmployeeCode}`;

          // const existingManagerIndex = this.managerInfo.findIndex(manager => manager.EmployeeCode === this.patchData.ManagerId.EmployeeCode);
          // const existingTeamLeadIndex = this.teamLeadInfo.findIndex(teamLead => teamLead.EmployeeCode === this.patchData.TeamLead.EmployeeCode);
          // if(existingManagerIndex === -1){
          //   this.managerInfo.push({
          //     ...this.patchData.ManagerId,
          //     view: managerView
          //   });
          // }
          // if(existingTeamLeadIndex === -1){
          //   this.teamLeadInfo.push({
          //     ...this.patchData.TeamLead,
          //     view: teamLeadView
          //   });
          // }
          const manager = {
            ...this.patchData.ManagerId,
            view: managerView
          };
          const teamLead = {
            ...this.patchData.TeamLead,
            view: teamLeadView
          };

          // this.managerInfo = [manager];
          // this.teamLeadInfo = [teamLead];
          this.updateForm.patchValue({
            ...this.patchData,
            ManagerId: this.patchData.ManagerId.EmployeeCode,
            TeamLead: this.patchData.TeamLead.EmployeeCode
          });
        }

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
        // console.log(this.managerInfo);
        this.viewManager = this.managerInfo;
      },error=>{
        console.error(error);
      }
    )

    this.employeeService.getAllTeamLead().subscribe(
      data=>{
        data.forEach((item: any)=>{
          const teamLeadObj = {
            FirstName: item.FirstName,
            LastName: item.LastName,
            EmployeeCode: item.EmployeeCode,
            view: item.FirstName + ' ' + item.LastName + ' - ' + item.EmployeeCode
          };
          this.teamLeadInfo.push(teamLeadObj);
        });
        this.viewTeamLead = this.teamLeadInfo
      },error=>{
        console.error(error)
      }
    )
  
  }


  getFullNameWithCode(employee: any): string {
    return `${employee.FirstName} ${employee.LastName} - ${employee.EmployeeCode}`;
  }

  updateForm = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator]],
    MiddleName: [''],
    LastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator]],
    EmployeeCode: [''],
    Photo: [''],
    Gender: [''],
    Contact: this.fb.group({
      CountryCode: [''],
      Primary: [''],
      Emergency: [''],
    }),
    Email: this.fb.group({
      CompanyMail: ['', [Validators.required, Validators.email, this.validEmail]],
      PersonalMail: [''],
    }),
    Location: this.fb.group({
      Flat: [''],
      Area: [''],
      Landmark: [''],
      Country: [''],
      State: [''],
      City: [''],
      Pincode: [''],
    }),
    dob: [''],
    doj: ['', [Validators.required]],
    doc: ['', [Validators.required]],
    SkillSet: this.fb.group({
      EmployeeSkillsetId: [''],
      PrimarySkillset: [''],
      SecondarySkillset: [''],
      SkillLevel: [''],
      Experience: [''],
      Certification: this.fb.group({
        CertificationName: [''],
        CertificationDate: ['']
      })
    }),
    ManagerId: [''],
    TeamLead: [''],
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
  validEmail(control: any) {
    const email = control.value;
    if (!email.match(/^(?!.*\.\..*)(?!.*\.{2,}@)[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)) {
      return { invalidEmail: true };
    }
    return null;
  }

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

  updateEmployee(){
    // this.managerId = this.updateForm.value.ManagerId;
    // if(this.managerId && this.managerId.length>0){
    //    this.setEmployeeCodeToManagerId = this.managerId[0].EmployeeCode
    // }
    this.updateForm.patchValue({
      Contact: {
        Primary: this.primaryE164Number,
        Emergency: this.emergencyE164Number
      },
      // ManagerId: this.setEmployeeCodeToManagerId,
    });
    console.log(this.updateForm.value)
    this.employeeService.updateEmployeeInfoById(this._id, this.userName, this.updateForm.value)
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
