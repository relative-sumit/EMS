import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeNavbarComponent } from '../employee-navbar/employee-navbar.component';
import { AuthService } from '../../../services/auth.service';
import { EncryptingDecryptingService } from '../../../services/encrypting-decrypting.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnumValuesService } from '../../../services/enum-values.service';

@Component({
  selector: 'app-skillset',
  standalone: true,
  imports: [EmployeeNavbarComponent, FormsModule, CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './skillset.component.html',
  styleUrl: './skillset.component.css'
})
export class SkillsetComponent implements OnInit{
  encrptedUserId: any;
  employeeInfo:any;
  userId: string = '';
  expanded: { [key: string]: boolean } = {};
  encrptedUsername:any;
  username: string = '';
  skillSet!:[string];
  skillLevel!: [string];

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
    private enumValues: EnumValuesService
  ){}

  ngOnInit(): void {
    this.encrptedUserId = sessionStorage.getItem('userId');
    this.userId = this.ed.decrypt(this.encrptedUserId);
    this.encrptedUsername = sessionStorage.getItem('username');
    this.username = this.ed.decrypt(this.encrptedUsername);
    this.auth.getEmployeeInfo(this.userId)
      .subscribe(
        data => {
          if (data) {
            this.updateForm.patchValue(data)
            this.employeeInfo = data
          }
        }
    );
    this.enumValues.getAllEnumValues()
    .subscribe(
      data=>{
        this.skillSet = data.Skillset
        this.skillLevel = data.SkillLevel
      }
    )  
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
      Pincode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$|^\d{6}$/)]],
      City: ['', [Validators.required]],
      State: ['', [Validators.required]],
    }),
    dob: ['', [Validators.required]],
    doj: ['', [Validators.required]],
    doc: ['', [Validators.required]],
    SkillSet: this.fb.group({
      EmployeeSkillsetId: [''],
      PrimarySkillset: ['', [Validators.required]],
      SecondarySkillset: [''],
      SkillLevel: ['', [Validators.required]],
      Experience: ['', [Validators.required]],
      Certification: this.fb.group({
        CertificationName: [''],
        CertificationDate: [''],
      }),
    }),
    ManagerId: ['', [Validators.required]],
    Designation: ['', [Validators.required]],
  });

  //validating names
  nameValidator(v: any){
    let pattern = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/
    if(pattern.test(v.value)){
      return null;
    }else{
      return {'onlyAlfa': true}
    }
  }
  validEmail(control: any) {
    const email = control.value;
    if (!email.match(/^(?!.*\.\..*)(?!.*\.{2,}@)[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)) {
      return { invalidEmail: true };
    }
    return null;
  }
  validExperience(control: any) {
    const experience = control.value;
    if (!experience.match(/^(0|[1-9]|[1-2][0-9]|29)(\.[0-9]{1,2})? years?$/)) {
      return { invalidExperience: true };
    }
    return null;
  }

  
  getSelectedPrimarySkills() {
    return this.updateForm.get('SkillSet.PrimarySkillset')?.value;
  }
  getSelectedSecondarySkills() {
    return this.updateForm.get('SkillSet.SecondarySkillset')?.value;
  }
  getRemainingPrimarySkills() {
    return this.skillSet.filter(skill => !this.getSelectedPrimarySkills()?.includes(skill));
  }
  getRemainingSecondarySkills() {
    return this.skillSet.filter(skill => !this.getSelectedSecondarySkills()?.includes(skill));
  }


  updateEmployee() {
    console.log(this.updateForm.value);
    console.log("UserId : ", this.userId);
    this.auth.updateEmployeeInfo(this.userId, this.username, this.updateForm.value)
    .subscribe(
      (result)=>{
        console.log(result);
        // this.route.navigate(['/employee-info/personal'])
        location.reload()
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
