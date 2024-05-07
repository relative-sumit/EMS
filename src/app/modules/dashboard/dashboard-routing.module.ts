import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { OrgStructureComponent } from './org-structure/org-structure.component';
import { TeamManagementComponent } from './team-management/team-management.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'asset-details', component: AssetDetailsComponent },
  { path: 'org-structure', component: OrgStructureComponent },
  { path: 'team-management', component: TeamManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
