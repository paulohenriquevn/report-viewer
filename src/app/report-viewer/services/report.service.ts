import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ReportConfig } from '../models/report-config.model';
import { ReportData } from '../models/report-data.model';
import { ExportService } from './export.service';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(
        private http: HttpClient,
        private exportService: ExportService
    ) { }

    /**
     * Carrega a configuração do relatório
     * @param configPath Caminho para o arquivo de configuração
     * @returns Promise com a configuração do relatório
     */
    async loadReportConfig(configPath: string): Promise<ReportConfig> {
        return firstValueFrom(this.http.get<ReportConfig>(configPath));
    }

    /**
     * Carrega os dados do relatório
     * @param dataSource Caminho para a fonte de dados
     * @returns Promise com os dados do relatório
     */
    async loadReportData(dataSource: string): Promise<ReportData> {
        return firstValueFrom(this.http.get<ReportData>(dataSource));
    }

    /**
     * Exporta o relatório no formato especificado
     * @param reportConfig Configuração do relatório
     * @param reportData Dados do relatório
     * @param format Formato de exportação (pdf, excel, csv, image)
     * @param options Opções adicionais de exportação
     * @returns Promise com o blob do arquivo exportado
     */
    async exportReport(
        reportConfig: ReportConfig,
        reportData: ReportData,
        format: string,
        options?: any
    ): Promise<Blob> {
        switch (format) {
            case 'pdf':
                return this.exportService.exportToPDF(reportConfig, reportData, options);
            case 'excel':
                return this.exportService.exportToExcel(reportConfig, reportData, options);
            case 'csv':
                return this.exportService.exportToCSV(reportConfig, reportData, options);
            case 'image':
                return this.exportService.exportToImage(reportConfig, reportData, options);
            default:
                throw new Error(`Formato '${format}' não suportado`);
        }
    }

    /**
     * Aplica parâmetros ao relatório
     * @param parameters Valores dos parâmetros
     * @returns Promise com os dados atualizados do relatório
     */
    async applyParameters(parameters: any): Promise<ReportData> {
        // Em um ambiente real, os parâmetros seriam enviados para o servidor
        // ou processados localmente para filtrar os dados
        console.log('Aplicando parâmetros:', parameters);
        return this.reportData;
    }
}