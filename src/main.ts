import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // Importazione corretta del componente principale

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));