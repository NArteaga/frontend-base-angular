import { Routes } from '@angular/router';
import { LoginLayout } from './layouts/login/login.component';
import { LoginPage } from './pages/login/login.component';
import { MainLayout } from './layouts/main/main.component';
import { BitacoraPage } from './pages/avances/bitacora/bitacora.component';
import { authGuard } from './guard/auth.guard';
import { NotFoundPage } from './pages/404/404.component';
import { UsuarioPage } from './pages/admin/usuario/usuario.component';
import { MenuPage } from './pages/admin/menu/menu.component';
import { HomePage } from './pages/home/home.component';
import { RolPage } from './pages/admin/rol/rol.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: LoginLayout,
    children: [
      { path: 'login', component: LoginPage }
    ]
  },
  {
    path: 'app',
    component: MainLayout,
    children: [
      { path: 'home', component: HomePage },
      {
        path: 'avances',
        children: [
          { path: 'bitacora', component: BitacoraPage },
        ]
      },
      {
        path: 'admin',
        children: [
          { path: 'usuario', component: UsuarioPage },
          { path: 'rol', component: RolPage },
          { path: 'menu', component: MenuPage },
        ]
      },
      { path: '404', component: NotFoundPage },
      { path: '**', redirectTo: '404', pathMatch: 'full' },
    ],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
];
