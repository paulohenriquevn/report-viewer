import { Component } from '@angular/core';
import { ReportViewerModule } from './report-viewer/report-viewer.module';

@Component({
  selector: 'app-root',
  imports: [ReportViewerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BI Report Viewer';
  
  // Caminho para o arquivo de configuração do relatório
  reportConfigPath = 'assets/reports/configs/report-config.json';
}