import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authGuard } from './guards/auth.guard';
import { EmployeeInfoComponent } from './components/employee-info/employee-info.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'employee-info', component: EmployeeInfoComponent, canActivate: [authGuard]},
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
