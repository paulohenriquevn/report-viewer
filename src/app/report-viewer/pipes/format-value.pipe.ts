import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatValue',
    standalone: true
})
export class FormatValuePipe implements PipeTransform {
    transform(value: any, format?: string): string {
        if (value === undefined || value === null) {
            return '';
        }

        if (format) {
            // Formatação com base no formato especificado
            switch (format) {
                case 'currency':
                    return this.formatCurrency(value);
                case 'percent':
                    return this.formatPercent(value);
                case 'date':
                    return this.formatDate(value);
                case 'number':
                    return this.formatNumber(value);
                default:
                    // Formatação personalizada com substituição de tokens
                    return format.replace(/{value}/g, String(value));
            }
        }

        // Sem formatação específica
        return String(value);
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    private formatPercent(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }

    private formatDate(value: string | Date): string {
        const date = typeof value === 'string' ? new Date(value) : value;
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }

    private formatNumber(value: number): string {
        return new Intl.NumberFormat('pt-BR').format(value);
    }
}