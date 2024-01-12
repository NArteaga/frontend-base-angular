import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { environment } from '@env'

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  private cookie = inject(CookieService)

  constructor() { }

  setItem = (key: string, value: string) => {
    key = `${environment.prefix}-${key}`
    if (environment.production) {
      key = btoa(key)
      value = JSON.stringify(value)
      value = btoa(value)
    }
    this.cookie.set(key, value)
  };
  getItem = (key: string) => {
    key = `${environment.prefix}-${key}`
    if (environment.production)
      key = btoa(key)
    let value = this.cookie.get(key)
    if (!value) return null
    if (environment.production)
      value = atob(value)
    return JSON.parse(value)
  };
  removeItem = (key: string) => {
    key = `${environment.prefix}-${key}`
    if (environment.production)
      key = btoa(key)
    this.cookie.delete(key)
  }
  clear = () => this.cookie.deleteAll()
}
