import { Injectable, inject } from '@angular/core';
import { HttpService } from '@common/http.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {
  private _http = inject(HttpService)
  constructor() { }

  findList() {
    return this._http.execute({
      method: 'GET',
      url: `/system/unidad/list`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
