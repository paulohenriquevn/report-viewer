import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Importações relacionadas ao ApexCharts
import { NgApexchartsModule } from 'ng-apexcharts';

// Componentes do Report Viewer
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { ReportParametersComponent } from './components/report-parameters/report-parameters.component';
import { ChartRendererComponent } from './components/chart-renderer/chart-renderer.component';
import { TableRendererComponent } from './components/table-renderer/table-renderer.component';
import { TextRendererComponent } from './components/text-renderer/text-renderer.component';
import { ImageRendererComponent } from './components/image-renderer/image-renderer.component';
import { TemplateManagerComponent } from './components/template-manager/template-manager.component';

// Serviços
import { ReportService } from './services/report.service';
import { TemplateService } from './services/template.service';
import { ExportService } from './services/export.service';

// Pipes
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormatValuePipe } from './pipes/format-value.pipe';

// Diretivas
import { HighlightSearchDirective } from './directives/highlight-search.directive';
import { ZoomDirective } from './directives/zoom.directive';

@NgModule({
    imports: [
        // Módulos
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgApexchartsModule,
        
        // Componentes standalone
        ReportViewerComponent,
        ReportParametersComponent,
        ChartRendererComponent,
        TableRendererComponent,
        TextRendererComponent,
        ImageRendererComponent,
        TemplateManagerComponent,
        
        // Pipes standalone
        SafeHtmlPipe,
        FormatValuePipe,
        
        // Diretivas standalone
        HighlightSearchDirective,
        ZoomDirective
    ],
    providers: [
        ReportService,
        TemplateService,
        ExportService
    ],
    exports: [
        CommonModule,
        ReportViewerComponent,
        ReportParametersComponent,
        TemplateManagerComponent
    ]
})
export class ReportViewerModule { }