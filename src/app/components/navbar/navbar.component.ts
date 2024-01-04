import { ThemeService } from './../../common/theme.service';
import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonModule } from 'primeng/button'
import { CookiesService } from '../../common/cookies.service';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  theme = 'sun'

  constructor(
    private themeService: ThemeService,
    private cookie: CookiesService,
  ) {}

  ngOnInit(): void {
    this.theme = this.cookie.getItem('theme') === 'dark' ? 'moon' : 'sun';
  }

  changeTheme = () => {
    this.themeService.changeMode()
    const theme = this.cookie.getItem('theme')
    this.theme = theme === 'dark' ? 'moon' : 'sun'
  }
}
