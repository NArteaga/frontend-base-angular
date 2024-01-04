import { Injectable, inject } from '@angular/core';
import axios from 'axios'
import { environment } from '../../environments/environment';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  cookie = inject(CookiesService)
  constructor() { }

  execute = async (
    config: {
      method: string,
      url: string,
      headers: Record<string, any>,
      data?: Record<string, any>
    }
  ) => {
    try {
      config.url = `${environment.baseUrl.api}${config.url}`
      const jwt = this.cookie.getItem('token')
      if (jwt) config.headers['Authorization'] = `Bearer ${jwt}`
      const result = await axios(config)
      if (!result?.data?.finalizado) return { error: result.data, result: null, type: 'error' };
      if (result?.data?.datos?.token) {
        this.cookie.setItem('token', result.data?.datos?.token)
        delete result.data?.datos?.token
      }
      return { error: null, result: result.data, type: 'success' };
    } catch (error: any) {
      const message = error?.response?.data || { mensaje: 'Error en la conexión' }
      return { error: message, result: null, type: 'error' };
    }
  }
}
