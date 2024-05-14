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
import { AssetService } from '../../../services/asset.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-asset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CommonModule,
  ],
  templateUrl: './update-asset.component.html',
  styleUrl: './update-asset.component.css',
})
export class UpdateAssetComponent implements OnInit {
  assetId: string = '';
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

  assetForm = this.formBuilder.group({
    AssetName: ['', Validators.required],
    AssetModel: ['', Validators.required],
    AssetType: ['', Validators.required],
    Memory: ['', Validators.required],
    Processor: ['', Validators.required],
    OperatingSystem: ['', Validators.required],
    Warranty: ['', Validators.required],
    AssetTag: ['', Validators.required],
    SerialNumber: ['', Validators.required],
    Description: [''],
    Addon: [''],
    IsWorkable: [false],
  });

  ngOnInit() {
    this.asset.asset.subscribe((data) => {
      this.assetForm.patchValue(data);
      this.assetId = data._id;
    });
  }

  onSubmit() {
    console.log(this.assetForm.value);
    if (this.assetForm.valid) {
      this.asset
        .updateAsset(this.assetId, this.assetForm.getRawValue())
        .subscribe((data) => {
          console.log(data);
          this.router.navigate(['dashboard/asset']);
        });
    } else {
      this.errorMessage = '*Please provide all the required fields';
    }
  }
}
