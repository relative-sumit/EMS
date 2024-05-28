import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AssetService } from '../../../services/asset.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnumValuesService } from '../../../services/enum-values.service';
import { AuthService } from '../../../services/auth.service';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css',
})
export class CreateAssetComponent implements OnInit {
  notificationMessage: string = '';
  creationSuccess: boolean = false;
  errorMessage: string = '';
  assetTypes!: string[];
  warrantyYears!: string[];
  assetStatusList!: string[];
  laptopOS!: string[];
  mobileOS!: string[];
  assignToList: any[] = [];
  assignToDropdownList: any[] = [];
  operatingSystems: { [key: string]: string[] } = {};
  currentOperatingSystems: string[] = [];

  dropdownSettings = {
    singleSelection: true,
    idField: 'EmployeeCode',
    textField: 'View',
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No employee found',
  };

  constructor(
    private formBuilder: FormBuilder,
    private asset: AssetService,
    private enumValues: EnumValuesService,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.enumValues.getAllEnumValues().subscribe((data) => {
      this.assetTypes = data.AssetType;
      this.warrantyYears = data.Warranty;
      this.laptopOS = data.LaptopOperatingSystem;
      this.mobileOS = data.MobileOperatingSystem;
      this.assetStatusList = data.AssetStatus;

      this.operatingSystems = {
        Laptop: this.laptopOS,
        Mobile: this.mobileOS,
        Mouse: [],
      };
    });

    this.auth.getAllEmployeesInfo().subscribe((data) => {
      data.forEach((item: any) => {
        const newObj = {
          FirstName: item.FirstName,
          LastName: item.LastName,
          EmployeeCode: item.EmployeeCode,
          View: item.FirstName + ' ' + item.LastName + '-' + item.EmployeeCode,
        };

        this.assignToList.push(newObj);
      });
      this.assignToDropdownList = this.assignToList;
    });

    this.onAssetTypeChange();
  }

  assetForm = this.formBuilder.group({
    AssetName: ['', [Validators.required, Validators.maxLength(15)]],
    AssetModel: ['', [Validators.required, Validators.maxLength(15)]],
    AssetType: [''],
    Memory: ['', [Validators.required, Validators.maxLength(15)]],
    Processor: ['', [Validators.required, Validators.maxLength(15)]],
    OperatingSystem: [''],
    Warranty: ['', Validators.required],
    AssetTag: ['', [Validators.required, Validators.maxLength(15)]],
    SerialNumber: ['', [Validators.required, Validators.maxLength(15)]],
    AssignTo: [''],
    AssignDate: [''],
    AssetPurchaseDate: [''],
    AssetStatus: [''],
    Cost: [''],
    Supplier: [''],
    Description: [''],
    Addon: [''],
    IsWorkable: [false],
  });

  onAssetTypeChange() {
    this.assetForm.get('AssetType')?.valueChanges.subscribe((selectedType) => {
      if (selectedType) {
        this.currentOperatingSystems =
          this.operatingSystems[selectedType] || [];
        if (selectedType === 'Mouse') {
          this.assetForm.get('OperatingSystem')?.clearValidators();
          this.assetForm.get('OperatingSystem')?.setValue('');
        } else {
          this.assetForm
            .get('OperatingSystem')
            ?.setValidators([Validators.required, Validators.maxLength(15)]);
        }
        this.assetForm.get('OperatingSystem')?.updateValueAndValidity();
      }
    });
  }

  clearForm() {
    this.assetForm.reset();
    Object.keys(this.assetForm.controls).forEach((key) => {
      const control = this.assetForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
    this.notificationMessage = '';
    this.errorMessage = '';
  }

  onSubmit() {
    console.log(this.assetForm.getRawValue().AssignTo);

    if (
      this.assetForm.valid &&
      this.assetForm.getRawValue().SerialNumber !== null
    ) {
      this.asset.createAsset(this.assetForm.getRawValue()).subscribe(
        (data) => {
          console.log('Data:', data);
          this.creationSuccess = true;
          this.errorMessage = '';
          this.notificationMessage = 'Asset created sucessfully';
        },
        (error) => {
          console.log('Error:', error.message);
          this.notificationMessage = 'Failure! Asset not created';
          this.creationSuccess = false;
        }
      );
    } else {
      this.errorMessage = '*Please provide all the required fields';
      this.creationSuccess = false;
      this.assetForm.markAllAsTouched();
    }
  }
}
