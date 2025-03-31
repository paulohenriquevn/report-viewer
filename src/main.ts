import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Inicializar aplicação
console.log("⚡ main.ts: Iniciando aplicação Angular");

document.addEventListener('DOMContentLoaded', () => {
  console.log("⚡ main.ts: DOM carregado, inicializando bootstrap");
  bootstrapApplication(AppComponent, appConfig)
    .then(() => console.log("✅ main.ts: Bootstrap concluído com sucesso"))
    .catch((err) => console.log("❌ main.ts: Erro no bootstrap - " + JSON.stringify(err)));
});
