import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private query = new BehaviorSubject('')
  private storage = inject(StorageService)
  private http = inject(HttpService)
  private select = new BehaviorSubject({ title: '', icon: '' })
  select$ = this.select.asObservable()
  query$ = this.query.asObservable()

  constructor() { }

  setQuery = (query: string) => this.query.next(query);
  changeSelect = (select: { title: '', icon: '' }) => this.select.next(select);

  loading = (form: FormGroup, state: boolean) => {
    for (const key in form.controls)
      if (!state) form.get(key)?.enable()
      else form.get(key)?.disable()
    return { form, state }
  }

  queryList(min: string, max: string) {
    const [minWidth] = min.split(' and ')
    const [_, maxWidth] = max.split(' and ')
    if (!maxWidth) return minWidth
    return `${minWidth} and ${maxWidth}`
  }

  async logout() {
    const theme = this.storage.local.getItem('theme')
    const token = this.storage.local.getItem('token')
    if (!token) return
    const { type } = await this.http.execute({
      method: 'GET',
      url: `/auth/logout`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (type === 'success') {
      this.storage.local.clear()
      this.storage.session.clear()
      this.storage.local.setItem('theme', theme)
    }
  }
}
