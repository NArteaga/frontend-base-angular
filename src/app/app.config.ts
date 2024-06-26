import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha'
import { MessageService } from 'primeng/api';

import { environment } from '@env'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    importProvidersFrom([BrowserAnimationsModule]),
    MessageService,
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.siteKey },
  ]
};
