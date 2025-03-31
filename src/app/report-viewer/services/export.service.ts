import { Injectable } from '@angular/core';
import { ReportConfig } from '../models/report-config.model';
import { ReportData } from '../models/report-data.model';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    constructor() { }

    /**
     * Exporta relatório para PDF
     */
    async exportToPDF(reportConfig: ReportConfig, reportData: ReportData, options?: any): Promise<Blob> {
        // Em um ambiente real, usaríamos bibliotecas como jsPDF
        // ou chamaríamos um serviço de backend para gerar o PDF

        // Simula tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Retorna um blob fictício
        return new Blob(['PDF content'], { type: 'application/pdf' });
    }

    /**
     * Exporta relatório para Excel
     */
    async exportToExcel(reportConfig: ReportConfig, reportData: ReportData, options?: any): Promise<Blob> {
        // Em um ambiente real, usaríamos bibliotecas como ExcelJS
        
        // Simula tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Retorna um blob fictício
        return new Blob(['Excel content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    /**
     * Exporta relatório para CSV
     */
    async exportToCSV(reportConfig: ReportConfig, reportData: ReportData, options?: any): Promise<Blob> {
        // Encontra a primeira tabela no relatório
        let tableData = null;
        let columns: { header: string; field: string }[] = [];

        // Procura a primeira tabela em todas as páginas
        for (const page of reportConfig.pages) {
            const tableElement = page.elements.find(element => element.type === 'table');
            if (tableElement && tableElement['dataSource'] && reportData[tableElement['dataSource']]) {
                tableData = reportData[tableElement['dataSource']];
                columns = tableElement['columns'];
                break;
            }
        }

        if (!tableData || !columns) {
            throw new Error('Não foi encontrada nenhuma tabela para exportar como CSV');
        }

        // Constrói o conteúdo do CSV
        let csvContent = '';

        // Adiciona linha de cabeçalho
        csvContent += columns.map(column => `"${column.header}"`).join(',') + '\n';

        // Adiciona linhas de dados
        tableData.forEach(row => {
            csvContent += columns.map(column => {
                const value = row[column.field];
                // Escapa aspas duplas e coloca entre aspas
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',') + '\n';
        });

        // Retorna o conteúdo como Blob
        return new Blob([csvContent], { type: 'text/csv' });
    }

    /**
     * Exporta relatório para imagem
     */
    async exportToImage(reportConfig: ReportConfig, reportData: ReportData, options?: any): Promise<Blob> {
        // Em um ambiente real, usaríamos bibliotecas como html2canvas
        
        // Simula tempo de processamento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Retorna um blob fictício
        return new Blob(['Image content'], { type: 'image/png' });
    }
}