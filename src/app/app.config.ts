import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ReportViewerModule } from './report-viewer/report-viewer.module';
import { provideHttpClient, withFetch, withJsonpSupport } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), withJsonpSupport()),
    importProvidersFrom(ReportViewerModule)
  ]
};
