import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import {  MatSelectModule } from '@angular/material/select';
import { EnumValuesService } from '../../../services/enum-values.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Country, State, City } from 'country-state-city';


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
    NgSelectModule,
    MatSelectModule,
    NgMultiSelectDropDownModule
  ],
  templateUrl: './create-employee-info.component.html',
  styleUrl: './create-employee-info.component.css'
})
export class CreateEmployeeInfoComponent implements OnInit{
  _id:String = '';
  fileSizeError: boolean = false;
  encryptedUserName: any;
  userName: String = '';
  postalCode: String = '';
  location: any;
  errorMessage: string = '';
  skillSet!:[string];
  designations!:[string];
  skillLevel!:[string];
  managerInfo: any[] = [];
  viewManager: any[] = [];
  teamLeadInfo: any[] = [];
  viewTeamLead: any[] = [];
  department!:[string];
  managerId: any;
  setEmployeeCodeToManagerId!:string
  countries: any[] = [];
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
  teamLeadDropdownSettings = {
    singleSelection: true,
    idField: 'EmployeeCode',
    textField: 'view',
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No manager found',
  }

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router,
    private ed: EncryptingDecryptingService,
    private enumValues: EnumValuesService,
    private cdr: ChangeDetectorRef
    ){}

  ngOnInit(): void {
    this.encryptedUserName = sessionStorage.getItem('username');
    this.userName = this.ed.decrypt(this.encryptedUserName);
    // this.addForm.get('Location.Pincode')?.valueChanges.subscribe(value => {
    //   if (this.addForm.get('Location.Pincode')?.valid) {
    //     this.onPostalCodeChange(value);
    //   }
    // });

    this.countries = Country.getAllCountries();
    this.addForm.get('Location.Country')?.valueChanges.subscribe((countryIsoCode) => {
      console.log(countryIsoCode);
      if (countryIsoCode) {
        this.onCountryChange(countryIsoCode);
      } else {
        this.states = [];
        this.cities = [];
        this.addForm.get('Location.State')?.reset();
        this.addForm.get('Location.City')?.reset();
      }
    })
    this.addForm.get('Location.State')?.valueChanges.subscribe((stateIsoCode) => {
      const countryIsoCode = this.addForm.get('Location.Country')?.value;
      if (countryIsoCode && stateIsoCode) {
        this.onStateChange(countryIsoCode, stateIsoCode);
      } else {
        this.cities = [];
        this.addForm.get('Location.City')?.reset();
      }
    });
    
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
        console.error(error);
      }
    )
  }

  addForm = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator]],
    MiddleName: [''],
    LastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), this.nameValidator]],
    EmployeeCode: [''],
    Photo: ['', Validators.required],
    Gender: ['', [Validators.required]],
    Contact: this.fb.group({
      CountryCode: [''],
      Primary: ['', [Validators.required]],
      Emergency: ['', [Validators.required]],
    }),
    Email: this.fb.group({
      CompanyMail: ['', [Validators.required,  Validators.email, this.validEmail]],
      PersonalMail: ['', [Validators.required, Validators.email, this.validEmail]],
    }),
    Location: this.fb.group({
      Flat: ['', [Validators.required]],
      Area: ['', [Validators.required]],
      Landmark: ['', [Validators.required]],
      Pincode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$|^\d{6}$/)]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
      Country: ['', [Validators.required]]
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
    TeamLead: [''],
    Department: this.fb.group({
      DepartmentName:['', [Validators.required]]
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
  //       this.addForm.patchValue({
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
  onCountryChange(countryIsoCode: string) {
    this.states = State.getStatesOfCountry(countryIsoCode);
    this.addForm.get('Location.State')?.reset();
    this.addForm.get('Location.City')?.reset();
    this.cities = [];
  }

  onStateChange(countryIsoCode: string, stateIsoCode: string) {
    this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
    this.addForm.get('Location.City')?.reset();
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


  addEmployee(){
    if(this.addForm.valid){
      this.addForm.patchValue({
        Contact: {
          Primary: this.primaryE164Number,
          Emergency: this.emergencyE164Number
        },
      });
      console.log(this.addForm.value);
      this.employeeService.createEmployeeInfo(this.userName, this.addForm.value)
      .subscribe(
        (data)=>{
          // console.log(data);
          this.route.navigate(['admin/employee-manage']);
        },error=>{
          console.error(error);
        }
      )
    }else{
      this.addForm.markAllAsTouched();
    }
  }
}
