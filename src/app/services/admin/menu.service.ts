import { Injectable, inject } from '@angular/core';
import { HttpService } from '@common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
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
      url: '/system/menu',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  private update(data: any, id: string) {
    return this._http.execute({
      method: 'PATCH',
      url: `/system/menu/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  findAll(data: any) {
    return this._http.execute({
      method: 'GET',
      url: `/system/menu?${this._http.query(data)}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  findGroup(tipo: string) {
    return this._http.execute({
      method: 'GET',
      url: `/system/menu/type/${tipo}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteById(id: string) {
    return this._http.execute({
      method: 'DELETE',
      url: `/system/menu/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
