import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './routes/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideNotification } from './providers/notificacao.provider';
import { provideAuth } from './providers/auth.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideNotification(),
    provideAuth()
  ],
};
