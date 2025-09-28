import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; 
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes'; 

// QUESTO COMMENTO FORZA UN NUOVO COMMIT PER SBLOCCARE IL DEPLOY FINALE
bootstrapApplication(AppComponent, { 
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
  ]
}).catch((err) => console.error(err));
