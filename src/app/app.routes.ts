import { Routes } from '@angular/router';
import { LoginLayout } from './layouts/login/login.component';
import { LoginPages } from './pages/login/login.component';
import { MainLayout } from './layouts/main/main.component';
import { ProyectosPage } from './pages/general/proyectos/proyectos.component';
import { authGuard } from './guard/auth.guard';
import { NotFoundPage } from './pages/404/404.component';

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
    component: MainLayout,
    children: [
      { path: 'general/proyectos', component: ProyectosPage },
      { path: '404', component: NotFoundPage },
      { path: '**', redirectTo: '404', pathMatch: 'full' }
    ],
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
