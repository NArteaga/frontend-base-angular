import { Injectable } from '@angular/core';
import axios from 'axios'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

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
      const jwt = `Bearer ${localStorage.getItem('token')}`
      if (jwt) config.headers['Authorization'] = jwt
      const result = await axios(config)
      if (result.data.finalizado) return { error: null, result: result.data, type: 'success' };
      return { error: result.data, result: null, type: 'error' };
    } catch (error: any) {
      const message = error?.response?.data || { mensaje: 'Error en la conexión' }
      return { error: message, result: null, type: 'error' };
    }
  }
}
