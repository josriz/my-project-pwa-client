import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- Importato per le chiamate API

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Mantiene la gestione predefinita del rilevamento delle modifiche (zone.js)
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    
    // ABILITA LE CHIAMATE HTTP (API)
    provideHttpClient(), 
    
    // ABILITA IL SERVICE WORKER PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Abilita solo in ambiente di produzione (dopo il build)
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
