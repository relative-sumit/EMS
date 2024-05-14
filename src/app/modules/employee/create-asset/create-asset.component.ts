import { Component } from '@angular/core';
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
import { AssetService } from '../../../services/asset.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
  ],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css',
})
export class CreateAssetComponent {
  assetForm!: FormGroup;
  notificationMessage: string = '';
  creationSuccess: boolean = false;
  errorMessage: string = '';
  assetTypes: string[] = [
    'Laptop',
    'Mobile',
    'Keyboard',
    'Mouse',
    'Wifi Router',
  ];

  warrantyYears: string[] = [
    '1 Year',
    '2 Year',
    '3 Year',
    '4 Year',
    '5 Year',
    '6 Year',
    '7 Year',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private asset: AssetService,
    private router: Router
  ) {}

  ngOnInit() {
    this.assetForm = this.formBuilder.group({
      assetName: ['', [Validators.required, Validators.maxLength(15)]],
      assetModel: ['', [Validators.required, Validators.maxLength(15)]],
      assetType: ['', Validators.required],
      memory: ['', [Validators.required, Validators.maxLength(15)]],
      processor: ['', [Validators.required, Validators.maxLength(15)]],
      operatingSystem: ['', [Validators.required, Validators.maxLength(15)]],
      warranty: ['', Validators.required],
      assetTag: ['', [Validators.required, Validators.maxLength(15)]],
      serialNumber: ['', [Validators.required, Validators.maxLength(15)]],
      description: [''],
      addon: [''],
      isWorkable: [false],
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
    console.log(this.assetForm.value);
    console.log(this.assetForm.valid);

    if (this.assetForm.valid) {
      this.asset.createAsset(this.assetForm.getRawValue()).subscribe(
        (data) => {
          console.log(data);
          this.creationSuccess = true;
          this.notificationMessage = 'Asset created sucessfully';
        },
        (error) => {
          this.notificationMessage = 'Asset not created';
          this.creationSuccess = false;
        }
      );
    } else {
      console.log('else');
      this.errorMessage = '*Please provide all the required fields';
      this.notificationMessage = 'Asset not created';
      this.creationSuccess = false;
    }
  }
}
