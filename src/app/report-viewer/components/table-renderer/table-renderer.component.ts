import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTableElement } from '../../models/report-element.model';
import { ReportElement as ConfigReportElement } from '../../models/report-config.model';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
    selector: 'app-table-renderer',
    standalone: true,
    imports: [CommonModule, SafeHtmlPipe],
    templateUrl: './table-renderer.component.html',
    styleUrls: ['./table-renderer.component.scss']
})
export class TableRendererComponent implements OnChanges {
    @Input() tableElement!: ReportTableElement | ConfigReportElement;
    @Input() tableData!: any[];
    @Input() zoomLevel: number = 100;
    @Input() searchTerm: string = '';

    sortedData: any[] = [];
    sortColumn: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tableData']) {
            this.sortedData = [...this.tableData];
        }
    }

    getHeaderStyle(column: any): any {
        const baseStyle: Record<string, any> = {};

        if (this.tableElement.headerFontSize) {
            baseStyle['fontSize'] = `${this.tableElement.headerFontSize * this.zoomLevel / 100}px`;
        }

        return { ...baseStyle, ...(this.tableElement.headerStyle || {}) };
    }

    getCellStyle(column: any): any {
        const baseStyle: Record<string, any> = {};

        if (this.tableElement.fontSize) {
            baseStyle['fontSize'] = `${this.tableElement.fontSize * this.zoomLevel / 100}px`;
        }

        return { ...baseStyle, ...(this.tableElement.cellStyle || {}) };
    }

    getRowClass(rowIndex: number): string {
        if (this.tableElement.zebraStripe && rowIndex % 2 === 1) {
            return 'bg-gray-50';
        }
        return '';
    }

    sortByColumn(column: any): void {
        const field = column.field;

        if (this.sortColumn === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = field;
            this.sortDirection = 'asc';
        }

        this.sortedData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];

            if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
                valueA = Number(valueA);
                valueB = Number(valueB);
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                return this.sortDirection === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            return this.sortDirection === 'asc'
                ? (valueA > valueB ? 1 : -1)
                : (valueA < valueB ? 1 : -1);
        });
    }

    highlightSearchTerm(text: string): string {
        if (!this.searchTerm || this.searchTerm.trim() === '' || typeof text !== 'string') {
            return text;
        }

        const escapedSearchTerm = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
    }

    formatValue(value: any, format: string): string {
        if (value === undefined || value === null) {
            return '';
        }

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

        return String(value);
    }
}