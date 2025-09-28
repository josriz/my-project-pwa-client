import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Corretto: importare AppComponent
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes'; // Corretto: importare 'routes' (minuscolo)

// Questo è il punto di avvio per le applicazioni Standalone
bootstrapApplication(AppComponent, { // Corretto: usare AppComponent
  providers: [
    // Questo è il provider critico che abilita le chiamate API
    provideHttpClient(),
    // Include il provider di routing con l'opzione input binding
    provideRouter(routes, withComponentInputBinding()),
  ]
}).catch((err) => console.error(err));