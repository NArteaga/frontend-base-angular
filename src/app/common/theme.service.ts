import { Injectable, inject, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  _storage = inject(StorageService)

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  changeMode = () => {
    let themeAction = this._storage.local.getItem('theme')
    themeAction = themeAction === 'light'? 'dark' : 'light';
    this._storage.local.setItem('theme', themeAction);
    const theme = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (theme) theme.href = `${themeAction}.css`
  }

  getTheme = () => {
    const themeAction = this._storage.local.getItem('theme') || 'light';
    const theme = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (theme) theme.href = `${themeAction}.css`
  }
}
