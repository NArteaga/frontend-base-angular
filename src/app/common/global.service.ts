import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private query: string = ''
  constructor() { }
  setQuery = (query: string) => this.query = query
  getQuery = () => this.query
}
