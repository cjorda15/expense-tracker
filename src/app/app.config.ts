import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAuth0} from '@auth0/auth0-angular'
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [ provideAuth0({
    domain: 'dev-oegjztszfmg5u10s.us.auth0.com',
    clientId: 'GtrXyiZiBqhT5KakkHW4le5QJDSxAJaL',
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  }),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
