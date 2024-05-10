import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css',
})
export class CreateAssetComponent {
  assetForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private asset: AssetService) {}

  ngOnInit() {
    this.assetForm = this.formBuilder.group({
      assetName: ['', Validators.required],
      assetModel: ['', Validators.required],
      assetType: ['', Validators.required],
      memory: [''],
      processor: [''],
      operatingSystem: [''],
      warranty: [''],
      assetTag: [''],
      serialNumber: [''],
      description: [''],
      addon: [''],
      isWorkable: [false],
    });
  }

  onSubmit() {
    console.log(this.assetForm.value);
    if (this.assetForm.valid) {
      this.asset.createAsset(this.assetForm.getRawValue()).subscribe((data) => {
        console.log(data);
      });
    }
  }
}
