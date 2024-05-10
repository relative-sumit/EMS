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
    path: 'asset-details',
    loadComponent: () =>
      import('./asset-details/asset-details.component').then(
        (c) => c.AssetDetailsComponent
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
    path: 'team-management',
    loadComponent: () =>
      import('./team-management/team-management.component').then(
        (c) => c.TeamManagementComponent
      ),
  },
  {
    path: 'create-asset',
    loadComponent: () =>
      import('./create-asset/create-asset.component').then(
        (c) => c.CreateAssetComponent
      ),
  },
  {
    path: 'asset',
    loadComponent: () =>
      import('./asset-details/asset-details.component').then(
        (c) => c.AssetDetailsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
