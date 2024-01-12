import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private query: string = ''
  private storage = inject(StorageService)
  constructor() { }
  setQuery = (query: string) => this.query = query
  getQuery = () => this.query

  loading = (form: FormGroup, state: boolean) => {
    for (const key in form.controls)
      if (!state) form.get(key)?.enable()
      else form.get(key)?.disable()
    return { form, state }
  }

  logout(): void {
    const theme = this.storage.local.getItem('theme')
    this.storage.local.clear()
    this.storage.session.clear()
    this.storage.local.setItem('theme', theme)
  }
}
