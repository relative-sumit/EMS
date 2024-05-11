import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-create-permission',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-permission.component.html',
  styleUrl: './create-permission.component.css',
})
export class CreatePermissionComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private admin: AdminService) {
    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-z]+(_[a-z]+)$/)],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.admin
        .createPermission(this.form.getRawValue().name)
        .subscribe((data) => console.log(data));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
