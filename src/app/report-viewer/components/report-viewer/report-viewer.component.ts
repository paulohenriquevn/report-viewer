import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { TemplateService } from '../../services/template.service';
import { ReportConfig } from '../../models/report-config.model';
import { ReportData } from '../../models/report-data.model';
import { ReportPage, ReportElement as ConfigReportElement } from '../../models/report-config.model';
import { 
    ReportElement, 
    ReportTextElement, 
    ReportTableElement, 
    ReportChartElement, 
    ReportImageElement 
} from '../../models/report-element.model';

// Standalone components
import { TemplateManagerComponent } from '../template-manager/template-manager.component';
import { ReportParametersComponent } from '../report-parameters/report-parameters.component';
import { TableRendererComponent } from '../table-renderer/table-renderer.component';
import { ChartRendererComponent } from '../chart-renderer/chart-renderer.component';
import { ImageRendererComponent } from '../image-renderer/image-renderer.component';
import { TextRendererComponent } from '../text-renderer/text-renderer.component';

// Directives and Pipes
import { HighlightSearchDirective } from '../../directives/highlight-search.directive';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
    selector: 'app-report-viewer',
    standalone: true,
    imports: [
        CommonModule,
        TemplateManagerComponent,
        ReportParametersComponent,
        TableRendererComponent,
        ChartRendererComponent,
        ImageRendererComponent,
        TextRendererComponent,
        HighlightSearchDirective,
        SafeHtmlPipe
    ],
    templateUrl: './report-viewer.component.html',
    styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerComponent implements OnInit {
    @Input() reportConfigPath!: string;

    reportConfig!: ReportConfig;
    reportData!: ReportData;
    selectedPage: number = 0;
    zoomLevel: number = 100;
    searchTerm: string = '';
    exportFormat: string = 'pdf';
    isLoading: boolean = false;
    error: string | null = null;
    selectedTemplate: string = '';

    constructor(
        private reportService: ReportService,
        private templateService: TemplateService
    ) { }

    ngOnInit(): void {
        this.loadReportConfig();
    }

    async loadReportConfig(): Promise<void> {
        try {
            this.isLoading = true;
            console.log('Carregando configuração do relatório:', this.reportConfigPath);
            this.reportConfig = await this.reportService.loadReportConfig(this.reportConfigPath);
            console.log('Configuração carregada:', this.reportConfig);

            // Definir template padrão
            if (this.reportConfig?.preferences?.template) {
                this.selectedTemplate = this.reportConfig.preferences.template;
            }

            if (this.reportConfig?.dataSource) {
                await this.loadReportData(this.reportConfig.dataSource);
            }

            this.isLoading = false;
            console.log('Página atual:', this.getCurrentPage());
        } catch (err) {
            console.error('Erro ao carregar configuração:', err);
            this.error = `Erro ao carregar configuração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
            this.isLoading = false;
        }
    }

    async loadReportData(dataSource: string): Promise<void> {
        try {
            console.log('Carregando dados do relatório:', dataSource);
            this.reportData = await this.reportService.loadReportData(dataSource);
            console.log('Dados carregados:', this.reportData);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            this.error = `Erro ao carregar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
        }
    }

    onParametersChange(parameters: { [key: string]: any }): void {
        console.log('Parâmetros atualizados:', parameters);
        // Adicione lógica para atualizar os dados do relatório com base nos parâmetros
    }

    onPrevPage(): void {
        if (this.selectedPage > 0) {
            this.selectedPage--;
        }
    }

    onNextPage(): void {
        if (this.reportConfig && this.selectedPage < this.reportConfig.pages.length - 1) {
            this.selectedPage++;
        }
    }

    onZoomIn(): void {
        this.zoomLevel = Math.min(200, this.zoomLevel + 10);
    }

    onZoomOut(): void {
        this.zoomLevel = Math.max(50, this.zoomLevel - 10);
    }

    onSearch(event: Event): void {
        this.searchTerm = (event.target as HTMLInputElement).value;
    }

    onExportFormatChange(event: Event): void {
        this.exportFormat = (event.target as HTMLSelectElement).value;
    }

    onExport(): void {
        this.reportService.exportReport(this.reportConfig, this.reportData, this.exportFormat)
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.reportConfig.reportName || 'report'}.${this.exportFormat}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                this.error = `Erro ao exportar relatório: ${err.message}`;
            });
    }

    async onTemplateSelected(templateId: string): Promise<void> {
        try {
            this.isLoading = true;
            this.selectedTemplate = templateId;

            // Aplica o template à configuração do relatório
            this.reportConfig = await this.templateService.applyTemplate(this.reportConfig, templateId);

            this.isLoading = false;
        } catch (err) {
            this.error = `Erro ao aplicar template: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
            this.isLoading = false;
        }
    }

    getCurrentPage(): ReportPage | null {
        if (!this.reportConfig || !this.reportConfig.pages || this.reportConfig.pages.length === 0) {
            return null;
        }

        return this.reportConfig.pages[this.selectedPage];
    }

    getElementStyle(element: ConfigReportElement): { [key: string]: string } {
        const baseStyle: { [key: string]: string } = {};

        if (element.type === 'text') {
            // Convertemos para o tipo ReportTextElement
            const textElement = element as unknown as ReportTextElement;
            
            if (textElement.fontSize) {
                baseStyle['fontSize'] = `${textElement.fontSize * this.zoomLevel / 100}px`;
            }

            if (textElement.bold) {
                baseStyle['fontWeight'] = 'bold';
            }

            if (textElement.italic) {
                baseStyle['fontStyle'] = 'italic';
            }

            if (textElement.underline) {
                baseStyle['textDecoration'] = 'underline';
            }

            if (textElement.color) {
                baseStyle['color'] = textElement.color;
            }

            if (textElement.align) {
                baseStyle['textAlign'] = textElement.align;
            }

            return { ...baseStyle, ...(textElement.style || {}) };
        }

        return baseStyle;
    }

    // Método para decidir qual renderizador usar
    getRendererType(element: ConfigReportElement): string {
        return element.type;
    }

    // Método para obter dados da fonte
    getElementData(element: ConfigReportElement): any[] {
        if ('dataSource' in element) {
            return this.reportData[element['dataSource']] || [];
        }
        return [];
    }
}