import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CardModule } from 'primeng/card'

@Component({
  selector: 'layout-login',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginLayout {
  constructor() {}
  year = new Date().getFullYear();

}
