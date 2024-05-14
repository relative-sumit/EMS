import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'create-permission',
    loadComponent: () =>
      import('./create-permission/create-permission.component').then(
        (c) => c.CreatePermissionComponent
      ),
  },
  {
    path: 'create-role',
    loadComponent: () =>
      import('./create-role/create-role.component').then(
        (c) => c.CreateRoleComponent
      ),
  },
  {
    path: 'employee-manage',
    loadComponent: () =>
      import('./employee-management/employee-management.component').then(
        (c) => c.EmployeeManagementComponent
      ),
  },
  {
    path: 'update-employee',
    loadComponent: () =>
      import('./update-employee/update-employee.component').then(
        (c) => c.UpdateEmployeeComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
