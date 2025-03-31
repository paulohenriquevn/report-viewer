import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { ChartRendererComponent } from './components/chart-renderer/chart-renderer.component';
import { TableRendererComponent } from './components/table-renderer/table-renderer.component';
import { TemplateManagerComponent } from './components/template-manager/template-manager.component';
import { ReportParametersComponent } from './components/report-parameters/report-parameters.component';
import { TextRendererComponent } from './components/text-renderer/text-renderer.component';
import { ImageRendererComponent } from './components/image-renderer/image-renderer.component';

// Serviços
import { ReportService } from './services/report.service';
import { TemplateService } from './services/template.service';
import { ExportService } from './services/export.service';
import { LoggingService } from './services/logging.service';
import { UtilsService } from './services/utils.service';

// Diretivas e Pipes
import { HighlightSearchDirective } from './directives/highlight-search.directive';
import { ZoomDirective } from './directives/zoom.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormatValuePipe } from './pipes/format-value.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [],
    providers: [
        ReportService,
        TemplateService,
        ExportService,
        LoggingService,
        UtilsService
    ]
})
export class ReportViewerModule { }