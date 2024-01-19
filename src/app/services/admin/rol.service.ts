import { Injectable, inject } from '@angular/core';
import { HttpService } from '@common/http.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
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
      url: '/system/rol',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  private update(data: any, id: string) {
    return this._http.execute({
      method: 'PATCH',
      url: `/system/rol/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  findAll(data: any) {
    return this._http.execute({
      method: 'GET',
      url: `/system/rol?${this._http.query(data)}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  findList() {
    return this._http.execute({
      method: 'GET',
      url: `/system/rol/list`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteById(id: string) {
    return this._http.execute({
      method: 'DELETE',
      url: `/system/rol/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
