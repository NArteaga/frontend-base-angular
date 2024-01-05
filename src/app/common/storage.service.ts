import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  private localStorage = this.document.defaultView?.localStorage
  private sessionStorage = this.document.defaultView?.sessionStorage
  local = {
    setItem: (key: string, value: any) => {
      key = `${environment.prefix}-${key}`
      if (environment.production) {
        key = btoa(key)
        value = JSON.stringify(value)
        value = btoa(value)
      }
      this.localStorage?.setItem(key, value)
    },
    getItem: (key: string) => {
      key = `${environment.prefix}-${key}`
      if (environment.production)
        key = btoa(key)
      let value = this.localStorage?.getItem(key)
      if (!value) return null
      if (environment.production)
        value = atob(value)
      return JSON.parse(value)
    },
    removeItem: (key: string) => {
      key = `${environment.prefix}-${key}`
      if (environment.production)
        key = btoa(key)
      this.localStorage?.removeItem(key)
    },
    clear: () => this.localStorage?.clear()
  }

  session = {
    setItem: (key: string, value: any) => {
      key = `${environment.prefix}-${key}`
      if (environment.production) {
        key = btoa(key)
        value = JSON.stringify(value)
        value = btoa(value)
      }
      this.sessionStorage?.setItem(key, value)
    },
    getItem: (key: string) => {
      key = `${environment.prefix}-${key}`
      if (environment.production)
        key = btoa(key)
      let value = this.sessionStorage?.getItem(key)
      if (!value) return null
      if (environment.production)
        value = atob(value)
      return JSON.parse(value)
    },
    removeItem: (key: string) => {
      key = `${environment.prefix}-${key}`
      if (environment.production)
        key = btoa(key)
        this.sessionStorage?.removeItem(key)
    },
    clear: () => this.sessionStorage?.clear()
  }
}
