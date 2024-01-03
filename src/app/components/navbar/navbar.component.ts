import { ThemeService } from './../../common/theme.service';
import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [ToolbarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  theme = 'sun'
  constructor(private themeService: ThemeService) {}
  ngOnInit(): void {
    // this.theme = localStorage.getItem('theme') === 'dark' ? 'moon' : 'sun'
  }
  changeTheme = () => {
    this.themeService.changeMode()
    const theme = localStorage.getItem('theme')
    this.theme = theme === 'dark' ? 'moon' : 'sun'
  }
}
