import { Injectable, inject, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  store = inject(CookiesService)

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  changeMode = () => {
    let themeAction = this.store.getItem('theme')
    themeAction = themeAction === 'light'? 'dark' : 'light';
    this.store.setItem('theme', themeAction);
    const theme = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (theme) theme.href = `${themeAction}.css`
  }

  getTheme = () => {
    const themeAction = this.store.getItem('theme')
    const theme = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (theme) theme.href = `${themeAction}.css`
  }
}
