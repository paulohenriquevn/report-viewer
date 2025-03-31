import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error("Erro no bootstrap:", err));
});
