import { Injectable, inject } from '@angular/core';
import { HttpService } from '@common/http.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private _http = inject(HttpService)
  constructor() { }

  save (data: any) {
    if (data?.id) {
      const { id } = data
      delete data.id
      return this.update(data, id)
    }
    delete data.id
    return this.create(data)
  }

  private create(data: any) {
    return this._http.execute({
      method: 'POST',
      url: '/system/funcionario',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  private update(data: any, id: string) {
    return this._http.execute({
      method: 'PATCH',
      url: `/system/funcionario/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  findAll(data: any) {
    return this._http.execute({
      method: 'GET',
      url: `/system/funcionario?${this._http.query(data)}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  infoUsuario(username: string) {
    return this._http.execute({
      method: 'GET',
      url: `/system/funcionario/info/${username}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteById(id: string) {
    return this._http.execute({
      method: 'DELETE',
      url: `/system/funcionario/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
