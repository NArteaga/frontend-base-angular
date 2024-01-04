import { Routes } from '@angular/router';
import { LoginLayout } from './layouts/login/login.component';
import { LoginPages } from './pages/login/login.component';
import { MainLayout } from './layouts/main/main.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginLayout,
    children: [
      { path: 'login', component: LoginPages },
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'app',
    component: MainLayout
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
