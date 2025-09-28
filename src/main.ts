import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ROUTES } from './app/app.routes'; // Assumi che app.routes esista, anche se vuoto

// Questo è il punto di avvio per le applicazioni Standalone
bootstrapApplication(App, {
  providers: [
    // Questo è il provider critico che abilita le chiamate API
    provideHttpClient(),
    // Include il provider di routing con l'opzione input binding
    provideRouter(ROUTES, withComponentInputBinding()),
  ]
}).catch((err) => console.error(err));