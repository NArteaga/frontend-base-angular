import { Injectable, inject } from '@angular/core';
import { GlobalService } from '@common/global.service';
import { HttpService } from '@common/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _http = inject(HttpService)
  private _global = inject(GlobalService)
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

  async verificar() {
    const value = await this._http.execute({
      method: 'GET',
      url: '/auth/verificar',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return value
  }
}
