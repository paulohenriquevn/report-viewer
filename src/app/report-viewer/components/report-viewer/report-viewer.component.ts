import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { TemplateService } from '../../services/template.service';
import { ReportConfig } from '../../models/report-config.model';
import { ReportData } from '../../models/report-data.model';

@Component({
    selector: 'app-report-viewer',
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
    error: string | undefined | null = null;
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
            this.reportConfig = await this.reportService.loadReportConfig(this.reportConfigPath);

            // Define o template se especificado nas preferências
            if (this.reportConfig?.preferences?.template) {
                this.selectedTemplate = this.reportConfig.preferences.template;
            }

            if (this.reportConfig?.dataSource) {
                await this.loadReportData(this.reportConfig.dataSource);
            }

            this.isLoading = false;
        } catch (err) {
            this.error = `Erro ao carregar configuração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
            this.isLoading = false;
        }
    }

    async loadReportData(dataSource: string): Promise<void> {
        try {
            this.reportData = await this.reportService.loadReportData(dataSource);
        } catch (err) {
            this.error = `Erro ao carregar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
        }
    }

    onPrevPage(): void {
        if (this.selectedPage > 0) {
            this.selectedPage--;
        }
    }

    onNextPage(): void {
        if (this.selectedPage < this.reportConfig.pages.length - 1) {
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

    getCurrentPage(): any {
        if (!this.reportConfig || !this.reportConfig.pages || this.reportConfig.pages.length === 0) {
            return null;
        }

        return this.reportConfig.pages[this.selectedPage];
    }

    getElementStyle(element: any): any {
        const baseStyle: Record<string, string> = {};

        if (element.fontSize) {
            baseStyle['fontSize'] = `${element.fontSize * this.zoomLevel / 100}px`;
        }

        if (element.bold) {
            baseStyle['fontWeight'] = 'bold';
        }

        if (element.italic) {
            baseStyle['fontStyle'] = 'italic';
        }

        if (element.underline) {
            baseStyle['textDecoration'] = 'underline';
        }

        if (element.color) {
            baseStyle['color'] = element.color;
        }

        if (element.align) {
            baseStyle['textAlign'] = element.align;
        }

        return { ...baseStyle, ...(element.style || {}) };
    }
}