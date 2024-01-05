import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private _http = inject(HttpService)
  constructor() { }

  create(data: any) {
    return this._http.execute({
      method: 'POST',
      url: '/general/proyecto',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  update(data: any, id: string) {
    return this._http.execute({
      method: 'PATCH',
      url: `/general/proyecto/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }

  findAll(data: any) {
    return this._http.execute({
      method: 'GET',
      url: `/general/proyecto?${this._http.query(data)}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })
  }
}
