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
    path: 'create-asset',
    loadComponent: () =>
      import('./create-asset/create-asset.component').then(
        (c) => c.CreateAssetComponent
      ),
  },
  {
    path: 'update-asset',
    loadComponent: () =>
      import('./update-asset/update-asset.component').then(
        (c) => c.UpdateAssetComponent
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
