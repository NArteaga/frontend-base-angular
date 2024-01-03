import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  changeMode = () => {
    let themeAction = localStorage.getItem('theme')
    themeAction = themeAction === 'light'? 'dark' : 'light';
    localStorage.setItem('theme', themeAction);
    const theme = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (theme) theme.href = `${themeAction}.css`
  }

  getTheme = () => {
    if (localStorage) {
      const themeAction = localStorage.getItem('theme')
      const theme = this.document.getElementById('app-theme') as HTMLLinkElement;
      if (theme) theme.href = `${themeAction}.css`
    }
    //console.log(window.localStorage.getItem('theme'))
  }
}
