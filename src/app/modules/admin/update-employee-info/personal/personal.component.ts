import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DisplayComponent } from '../display/display.component';
import { EmployeeService } from '../../../../services/employee.service';
import { EnumValuesService } from '../../../../services/enum-values.service';
import { Country, State, City } from 'country-state-city';
import { Router } from '@angular/router';
import { EncryptingDecryptingService } from '../../../../services/encrypting-decrypting.service';
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


@Component({
  selector: 'app-personal',
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
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit{
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
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedState!: string;
  selectedCity!: string;
  employeeInfo: any;

  managerDropdownSettings = {
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
    // this.states = State.getStatesOfCountry('IN');
    this.countries = Country.getAllCountries();
    this.updateForm.get('Location.Country')?.valueChanges.subscribe((countryIsoCode) => {
      console.log(countryIsoCode);
      if (countryIsoCode) {
        this.onCountryChange(countryIsoCode);
      } else {
        this.states = [];
        this.cities = [];
        // this.updateForm.get('Location.State')?.reset();
        // this.updateForm.get('Location.City')?.reset();
      }
    })
    this.updateForm.get('Location.State')?.valueChanges.subscribe((stateIsoCode) => {
      const countryIsoCode = this.updateForm.get('Location.Country')?.value;
      if (countryIsoCode && stateIsoCode) {
        console.log(countryIsoCode, stateIsoCode)
        this.onStateChange(countryIsoCode, stateIsoCode);
      } else {
        this.cities = [];
        // this.updateForm.get('Location.City')?.reset();
      }
    });
    this.employeeService.employeeInfo
    .subscribe(
      (data)=>{
        console.log(data); 
        this._id = data._id
        this.employeeInfo = data
        // console.log(this._id);
        // if(this.employeeInfo && this.employeeInfo.Location){
          this.updateForm.patchValue(this.employeeInfo);
          const countryIsoCode = this.updateForm.get('Location.Country')?.value;
          if (countryIsoCode) {
              this.onCountryChange(countryIsoCode);
              const stateIsoCode = this.updateForm.get('Location.State')?.value;
              if (stateIsoCode) {
                  this.onStateChange(countryIsoCode, stateIsoCode);
              }
          }
      },error=>{
        console.error(error);
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
    FirstName: [''],
    MiddleName: [''],
    LastName: [''],
    EmployeeCode: [''],
    Photo: ['', [Validators.required]],
    Gender: ['', [Validators.required]],
    Contact: this.fb.group({
      CountryCode: [''],
      Primary: ['', [Validators.required]],
      Emergency: ['', [Validators.required]],
    }),
    Email: this.fb.group({
      CompanyMail: [''],
      PersonalMail: ['', [Validators.required, Validators.email, this.validEmail]],
    }),
    Location: this.fb.group({
      Flat: ['', [Validators.required]],
      Area: ['', [Validators.required]],
      Landmark: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      State: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Pincode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$|^\d{6}$/)]],
    }),
    dob: ['', [Validators.required]],
    doj: [''],
    doc: [''],
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
      DepartmentName:[''],
    }),
    Designation: [''],
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

  onCountryChange(countryIsoCode: string) {
    this.states = State.getStatesOfCountry(countryIsoCode);
    // this.updateForm.get('Location.State')?.reset();
    // this.updateForm.get('Location.City')?.reset();
    // this.cities = [];
  }

  onStateChange(countryIsoCode: string, stateIsoCode: string) {
    this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
    // this.updateForm.get('Location.City')?.reset();
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
    console.log("updated form: ",this.updateForm.value)
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
