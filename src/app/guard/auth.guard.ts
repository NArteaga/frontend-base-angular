import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../common/cookies.service';
import { inject } from '@angular/core';
import { LoginService } from '../service/login/login.service';
import { StorageService } from '../common/storage.service';





export const authGuard: CanActivateFn = async (route, state) => {
  const cookies = inject(CookiesService)
  const storage = inject(StorageService)
  const auth = inject(LoginService)
  const router = inject(Router)
  const logout = () => {
    const theme = cookies.getItem('theme')
    cookies.clear()
    storage.local.clear()
    storage.session.clear()
    cookies.setItem('theme', theme)
    router.navigate(['/login'])
  }
  try {
    const token = cookies.getItem('token');
    if (!token) {
      logout();
      return false;
    }
    const { result, type } = await auth.verificar()
    if (type === 'error') {
      logout();
      return false;
    }
    const permisos = storage.local.getItem('permisos');
    permisos['/app/404'] = []
    if (!permisos[state.url]) router.navigate(['/app/404']);
    return true;
  } catch (error) {
    logout();
    return false;
  }
};
