import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
  },
  {
    path: 'org-structure',
    loadComponent: () =>
      import('./org-structure/org-structure.component').then(
        (c) => c.OrgStructureComponent
      ),
  },
  {
    path: 'asset',
    loadComponent: () =>
      import('../admin/asset-details/asset-details.component').then(
        (c) => c.AssetDetailsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
