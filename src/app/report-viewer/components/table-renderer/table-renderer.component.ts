import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReportTableElement } from '../../models/report-element.model';

@Component({
    selector: 'app-table-renderer',
    templateUrl: './table-renderer.component.html',
    styleUrls: ['./table-renderer.component.scss']
})
export class TableRendererComponent implements OnChanges {
    @Input() tableElement!: ReportTableElement;
    @Input() tableData!: any[];
    @Input() zoomLevel: number = 100;
    @Input() searchTerm: string = '';

    sortedData: any[] = [];
    sortColumn: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tableData']) {
            // Inicializa os dados ordenados com os dados originais
            this.sortedData = [...this.tableData];
        }
    }

    getHeaderStyle(column: any): any {
        const baseStyle: Record<string, any> = {};

        if (this.tableElement.headerFontSize) {
            baseStyle['fontSize'] = `${this.tableElement.headerFontSize * this.zoomLevel / 100}px`;
        }

        // Combina com os estilos definidos no elemento da tabela
        return { ...baseStyle, ...(this.tableElement.headerStyle || {}) };
    }

    getCellStyle(column: any): any {
        const baseStyle: Record<string, any> = {};

        if (this.tableElement.fontSize) {
            baseStyle['fontSize'] = `${this.tableElement.fontSize * this.zoomLevel / 100}px`;
        }

        // Combina com os estilos definidos no elemento da tabela
        return { ...baseStyle, ...(this.tableElement.cellStyle || {}) };
    }

    getRowClass(rowIndex: number): string {
        // Aplica classe de zebra se configurado
        if (this.tableElement.zebraStripe && rowIndex % 2 === 1) {
            return 'bg-gray-50';
        }
        return '';
    }

    sortByColumn(column: any): void {
        const field = column.field;

        // Se já estiver ordenando por esta coluna, inverte a direção
        if (this.sortColumn === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Define nova coluna e direção padrão
            this.sortColumn = field;
            this.sortDirection = 'asc';
        }

        // Ordena os dados
        this.sortedData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];

            // Verifica se os valores são numéricos
            if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
                valueA = Number(valueA);
                valueB = Number(valueB);
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                // Compara strings ignorando case
                return this.sortDirection === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            // Compara valores
            return this.sortDirection === 'asc'
                ? (valueA > valueB ? 1 : -1)
                : (valueA < valueB ? 1 : -1);
        });
    }

    highlightSearchTerm(text: string): string {
        if (!this.searchTerm || this.searchTerm.trim() === '' || typeof text !== 'string') {
            return text;
        }

        // Escapa caracteres especiais regex
        const escapedSearchTerm = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Cria regex para substituição
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        // Substitui o termo com a versão destacada
        return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
    }

    formatValue(value: any, format: string): string {
        if (value === undefined || value === null) {
            return '';
        }

        // Lógica básica de formatação
        if (format === 'currency') {
            return `R$ ${Number(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }

        if (format === 'percent') {
            return `${Number(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            })}%`;
        }

        if (format === 'date' && value instanceof Date) {
            return value.toLocaleDateString('pt-BR');
        }

        // Sem formatação específica
        return String(value);
    }
}