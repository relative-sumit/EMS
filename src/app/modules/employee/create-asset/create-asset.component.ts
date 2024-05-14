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
      assetName: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetType: ['', Validators.required],
      memory: ['', Validators.required],
      processor: ['', Validators.required],
      operatingSystem: ['', Validators.required],
      warranty: ['', Validators.required],
      assetTag: ['', Validators.required],
      serialNumber: ['', Validators.required],
      description: [''],
      addon: [''],
      isWorkable: [false],
    });
  }

  clearForm() {
    this.assetForm.reset();
    Object.keys(this.assetForm.controls).forEach(key => {
      const control = this.assetForm.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }

  onSubmit() {
    console.log(this.assetForm.value);
    if (this.assetForm.valid) {
      this.asset.createAsset(this.assetForm.getRawValue()).subscribe((data) => {
        console.log(data);
      });
    } else {
      this.errorMessage = '*Please provide all the required fields';
    }
  }
}
