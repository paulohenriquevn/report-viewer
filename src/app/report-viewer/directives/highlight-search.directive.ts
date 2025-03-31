import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[highlightSearch]',
    standalone: true
})
export class HighlightSearchDirective implements OnChanges {
    @Input() searchTerm: string = '';
    private originalContent: string = '';

    constructor(private el: ElementRef) {
        // Salva o conteúdo original do elemento
        this.originalContent = this.el.nativeElement.innerHTML;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['searchTerm']) {
            this.highlightText();
        }
    }

    private highlightText(): void {
        // Restaura o conteúdo original
        this.el.nativeElement.innerHTML = this.originalContent;

        // Se não houver termo de pesquisa, retorna
        if (!this.searchTerm || this.searchTerm.trim() === '') {
            return;
        }

        // Obtém o conteúdo do elemento
        const content = this.el.nativeElement.innerHTML;

        // Cria expressão regular para substituição, ignorando case
        const regex = new RegExp(this.escapeRegExp(this.searchTerm), 'gi');

        // Substitui o termo com a versão destacada
        const highlightedContent = content.replace(regex, (match: string) =>
            `<span class="bg-yellow-200">${match}</span>`
        );

        // Atualiza o conteúdo do elemento
        this.el.nativeElement.innerHTML = highlightedContent;
    }

    private escapeRegExp(string: string): string {
        // Escapa caracteres especiais de regex
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}