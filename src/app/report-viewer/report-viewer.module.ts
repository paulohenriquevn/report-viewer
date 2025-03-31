import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';

// Import standalone components
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { ReportParametersComponent } from './components/report-parameters/report-parameters.component';
import { ChartRendererComponent } from './components/chart-renderer/chart-renderer.component';
import { TableRendererComponent } from './components/table-renderer/table-renderer.component';
import { TextRendererComponent } from './components/text-renderer/text-renderer.component';
import { ImageRendererComponent } from './components/image-renderer/image-renderer.component';
import { TemplateManagerComponent } from './components/template-manager/template-manager.component';

// Import standalone pipes and directives
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormatValuePipe } from './pipes/format-value.pipe';
import { HighlightSearchDirective } from './directives/highlight-search.directive';
import { ZoomDirective } from './directives/zoom.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgApexchartsModule,

        // Import standalone components
        ReportViewerComponent,
        ReportParametersComponent,
        ChartRendererComponent,
        TableRendererComponent,
        TextRendererComponent,
        ImageRendererComponent,
        TemplateManagerComponent,

        // Import standalone pipes and directives
        SafeHtmlPipe,
        FormatValuePipe,
        HighlightSearchDirective,
        ZoomDirective
    ],
    exports: [
        ReportViewerComponent,
        ReportParametersComponent,
        TemplateManagerComponent
    ]
})
export class ReportViewerModule { }