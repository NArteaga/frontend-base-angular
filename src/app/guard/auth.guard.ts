import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '@services/login/login.service';
import { StorageService } from '@common/storage.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const storage = inject(StorageService)
  const auth = inject(LoginService)
  const router = inject(Router)
  const logout = () => {
    const theme = storage.local.getItem('theme')
    storage.local.clear()
    storage.local.clear()
    storage.session.clear()
    storage.local.setItem('theme', theme)
    router.navigate(['/login'])
  }
  try {
    const token = storage.local.getItem('token');
    if (!token) {
      logout();
      return false;
    }
    const { type } = await auth.verificar()
    if (type === 'error') {
      logout();
      return false;
    }
    const permisos = storage.local.getItem('permisos');
    permisos['/app/404'] = ['VER']
    if (!permisos[state.url]) router.navigate(['/app/404']);
    return true;
  } catch (error) {
    logout();
    return false;
  }
};
