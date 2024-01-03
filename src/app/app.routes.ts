import { Routes } from '@angular/router';
import { LoginLayout } from './layouts/login/login.component';
import { LoginPages } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginLayout,
    children: [
      { path: 'login', component: LoginPages },
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];
