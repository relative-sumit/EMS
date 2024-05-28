import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PersonalComponent } from './personal/personal.component';
import { SkillsetComponent } from './skillset/skillset.component';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent},
  {path:'personal', component: PersonalComponent},
  {path: 'skillset', component: SkillsetComponent},
  {path: '', redirectTo:'profile', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateEmployeeInfoRoutingModule { }
