import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { TemplateService } from '../../services/template.service';
import { ReportConfig } from '../../models/report-config.model';
import { ReportData } from '../../models/report-data.model';
import { ReportPage, ReportElement as ConfigReportElement } from '../../models/report-config.model';
import { 
    ReportTextElement, 
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
    canScrollLeft: boolean = false;
    canScrollRight: boolean = false;

    constructor(
        private reportService: ReportService,
        private templateService: TemplateService
    ) { }

    ngOnInit(): void {
        // Solução temporária: criar um relatório estático
        // this.createStaticReport();
        
        // Método original (desativado temporariamente)
        setTimeout(() => this.loadReportConfig(), 100);
        
        // Adicionar listeners para detectar scrollabilidade
        setTimeout(() => this.setupScrollIndicators(), 500);
    }
    
    setupScrollIndicators(): void {
        const scrollContainer = document.querySelector('.report-scroll-container');
        if (scrollContainer) {
            // Verificar inicialmente
            this.checkScrollability(scrollContainer as HTMLElement);
            
            // Verificar durante o scroll
            scrollContainer.addEventListener('scroll', () => {
                this.checkScrollability(scrollContainer as HTMLElement);
            });
            
            // Adicionar clique nos indicadores
            const leftIndicator = document.querySelector('.scroll-indicator-left');
            const rightIndicator = document.querySelector('.scroll-indicator-right');
            
            if (leftIndicator) {
                leftIndicator.addEventListener('click', () => {
                    scrollContainer.scrollLeft -= 100;
                });
            }
            
            if (rightIndicator) {
                rightIndicator.addEventListener('click', () => {
                    scrollContainer.scrollLeft += 100;
                });
            }
            
            // Atualizar quando o zoom mudar
            window.addEventListener('resize', () => {
                this.checkScrollability(scrollContainer as HTMLElement);
            });
        }
    }
    
    checkScrollability(element: HTMLElement): void {
        // Verificar se pode rolar para a esquerda
        this.canScrollLeft = element.scrollLeft > 0;
        
        // Verificar se pode rolar para a direita
        this.canScrollRight = element.scrollWidth > element.clientWidth && 
                             element.scrollLeft < (element.scrollWidth - element.clientWidth);
    }
    
    // Cria um relatório estático para demonstração
    createStaticReport(): void {
        this.isLoading = true;
        this.isLoading = false;
    }

    async loadReportConfig(): Promise<void> {
        try {
            this.isLoading = true;
            this.reportConfig = await this.reportService.loadReportConfig(this.reportConfigPath);

            // Definir template padrão
            if (this.reportConfig?.preferences?.template) {
                this.selectedTemplate = this.reportConfig.preferences.template;
            }

            if (this.reportConfig?.dataSource) {
                await this.loadReportData(this.reportConfig.dataSource);
            }

            this.isLoading = false;
        } catch (err) {
            console.error('Erro ao carregar configuração:', err);
            this.error = `Erro ao carregar configuração: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
            this.isLoading = false;
        }
    }

    async loadReportData(dataSource: string): Promise<void> {
        try {
            this.reportData = await this.reportService.loadReportData(dataSource);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            this.error = `Erro ao carregar dados: ${err instanceof Error ? err.message : 'Erro desconhecido'}`;
        }
    }

    onParametersChange(parameters: { [key: string]: any }): void {
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
        this.zoomLevel = Math.min(200, this.zoomLevel + 25);
    }

    onZoomOut(): void {
        this.zoomLevel = Math.max(50, this.zoomLevel - 25);
    }
    
    onZoomChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.zoomLevel = parseInt(target.value, 10);
        
        // Atualizar indicadores de scroll após mudança de zoom
        setTimeout(() => {
            const scrollContainer = document.querySelector('.report-scroll-container');
            if (scrollContainer) {
                this.checkScrollability(scrollContainer as HTMLElement);
            }
        }, 100);
    }
    
    goToPage(event: Event): void {
        const target = event.target as HTMLInputElement;
        const page = parseInt(target.value, 10);
        
        if (this.reportConfig && 
            page >= 1 && page <= this.reportConfig.pages.length) {
            this.selectedPage = page - 1;
        } else {
            // Reset to current page if invalid
            target.value = (this.selectedPage + 1).toString();
        }
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
        if ('dataSource' in element && element['dataSource']) {
            const dataSourceName = element['dataSource'];
            
            if (this.reportData && this.reportData[dataSourceName]) {
                return this.reportData[dataSourceName];
            }
        }
        
        return [];
    }
}