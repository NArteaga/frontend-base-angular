import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _http = inject(HttpService)
  constructor() {}

  login(data: any, token: string) {
    return this._http.execute({
      method: 'POST',
      url: '/auth/login',
      headers: {
        'Content-Type': 'application/json',
        'Recaptcha-Token': token
      },
      data
    })
  }

  verificar() {
    return this._http.execute({
      method: 'GET',
      url: '/auth/verificar',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
