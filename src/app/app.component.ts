import { Component, OnInit } from '@angular/core';
import { ReportViewerModule } from './report-viewer/report-viewer.module';
import { ReportViewerComponent } from './report-viewer/components/report-viewer/report-viewer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReportViewerModule, ReportViewerComponent],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
      
      <div *ngIf="isLoading" class="p-4 bg-blue-100 text-blue-800 rounded">
        Carregando...
      </div>
      
      <div *ngIf="error" class="p-4 bg-red-100 text-red-800 rounded">
        <strong>Erro:</strong> {{ error }}
      </div>
      
      <div *ngIf="!isLoading && !error" class="p-4 bg-green-100 text-green-800 rounded">
        Aplicação carregada com sucesso!
      </div>
      
      <hr class="my-4">
      
      <!-- Componente de visualização de relatórios -->
      <app-report-viewer [reportConfigPath]="reportConfigPath"></app-report-viewer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'BI Report Viewer';
  isLoading = true;
  error = '';
  
  // Caminho para o arquivo de configuração do relatório
  reportConfigPath = './assets/reports/configs/nota-fiscal.json';
  
  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}