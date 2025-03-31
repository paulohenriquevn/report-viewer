import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[highlightSearch]',
    standalone: true
})
export class HighlightSearchDirective implements OnChanges {
    @Input('highlightSearch') searchTerm: string = '';

    constructor(private el: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['searchTerm']) {
            this.highlightText();
        }
    }

    private highlightText(): void {
        const content = this.el.nativeElement.textContent;
        
        if (!this.searchTerm || this.searchTerm.trim() === '') {
            this.el.nativeElement.innerHTML = content;
            return;
        }

        const regex = new RegExp(`(${this.escapeRegExp(this.searchTerm)})`, 'gi');
        const highlightedContent = content.replace(regex, 
            `<span class="bg-yellow-200">$1</span>`
        );

        this.el.nativeElement.innerHTML = highlightedContent;
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}