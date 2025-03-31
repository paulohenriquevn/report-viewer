import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Serviços
import { ReportService } from './services/report.service';
import { TemplateService } from './services/template.service';
import { ExportService } from './services/export.service';
import { LoggingService } from './services/logging.service';
import { UtilsService } from './services/utils.service';

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