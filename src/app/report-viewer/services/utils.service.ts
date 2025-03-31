import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    /**
     * Formata valor de acordo com o tipo especificado
     * @param value Valor a ser formatado
     * @param format Tipo de formatação
     * @returns Valor formatado como string
     */
    formatValue(value: any, format?: string): string {
        if (value === undefined || value === null) {
            return '';
        }

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
                return format 
                    ? format.replace(/{value}/g, String(value)) 
                    : String(value);
        }
    }

    /**
     * Formata valor como moeda brasileira
     * @param value Valor numérico
     * @returns Valor formatado como moeda
     */
    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    /**
     * Formata valor como porcentagem
     * @param value Valor numérico
     * @returns Valor formatado como porcentagem
     */
    private formatPercent(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }

    /**
     * Formata data
     * @param value Data ou string de data
     * @returns Data formatada
     */
    private formatDate(value: string | Date): string {
        const date = typeof value === 'string' ? new Date(value) : value;
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }

    /**
     * Formata número
     * @param value Valor numérico
     * @returns Número formatado
     */
    private formatNumber(value: number): string {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    /**
     * Escape de texto para uso em regex
     * @param text Texto a ser escapado
     * @returns Texto escapado
     */
    escapeRegExp(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Highlight de texto
     * @param text Texto original
     * @param searchTerm Termo de busca
     * @returns Texto com highlight
     */
    highlightText(text: string, searchTerm: string): string {
        if (!searchTerm || searchTerm.trim() === '' || typeof text !== 'string') {
            return text;
        }

        const escapedSearchTerm = this.escapeRegExp(searchTerm);
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

        return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
    }

    /**
     * Gera um identificador único
     * @returns string com identificador único
     */
    generateUniqueId(): string {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    }
}