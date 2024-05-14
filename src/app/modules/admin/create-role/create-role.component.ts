import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

interface Permission {
  Name: string;
}
@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgMultiSelectDropDownModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css',
})
export class CreateRoleComponent implements OnInit {
  form: FormGroup;
  permissionDropdownList: Permission[] = [];
  errorMessage: string = '';

  selectedPermissions = [];

  dropdownSettings = {
    singleSelection: false,
    idField: 'Name',
    textField: 'Name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 5,
    allowSearchFilter: true,
  };

  constructor(private formBuilder: FormBuilder, private admin: AdminService) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      permissions: [[], Validators.required],
    });
  }
  ngOnInit(): void {
    this.admin.getAllPermission().subscribe((data) => {
      this.permissionDropdownList = data;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.admin
        .createRole(
          this.form.getRawValue().name,
          this.form.getRawValue().description,
          this.form.getRawValue().permissions
        )
        .subscribe((data) => console.log(data));
    } else {
      this.errorMessage = '*Please provide all the required fields';
      this.form.markAllAsTouched();
    }
  }
}
