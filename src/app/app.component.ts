import { Component } from '@angular/core';
import { ReportViewerModule } from './report-viewer/report-viewer.module';
import { ReportViewerComponent } from './report-viewer/components/report-viewer/report-viewer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReportViewerModule, ReportViewerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BI Report Viewer';
  
  // Caminho para o arquivo de configuração do relatório
  reportConfigPath = './assets/reports/configs/report-config.json';
}