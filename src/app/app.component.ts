import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { ThemeService } from './common/theme.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RecaptchaV3Module, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sisger-frontend';

  constructor(private theme: ThemeService) {}

  ngOnInit(): void {
    //this.theme.getTheme();
  }
}
