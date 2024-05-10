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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
