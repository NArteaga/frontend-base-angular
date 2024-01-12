import { ThemeService } from '@common/theme.service';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card'

@Component({
  selector: 'layout-login',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginLayout implements OnInit {
  year = new Date().getFullYear();

  constructor(
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.getTheme();
  }

}
