import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeNavbarComponent } from './employee-navbar/employee-navbar.component';
import { PersonalComponent } from './personal/personal.component';
import { SkillsetComponent } from './skillset/skillset.component';
import { AssetsComponent } from './assets/assets.component';

const routes: Routes = [
  {path: 'personal', component: PersonalComponent},
  {path:'skillset', component: SkillsetComponent},
  {path: 'assets', component: AssetsComponent},
  {path: '', redirectTo:'personal', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeInfoRoutingModule { }
