import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appZoom]',
    standalone: true
})
export class ZoomDirective implements OnChanges {
    @Input() zoomLevel: number = 100;
    @Input() zoomTarget: 'width' | 'height' | 'both' = 'both';

    private originalWidth: number;
    private originalHeight: number;

    constructor(private el: ElementRef) {
        // Salva as dimensões originais do elemento
        this.originalWidth = this.el.nativeElement.offsetWidth;
        this.originalHeight = this.el.nativeElement.offsetHeight;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['zoomLevel']) {
            this.applyZoom();
        }
    }

    private applyZoom(): void {
        const factor = this.zoomLevel / 100;

        if (this.zoomTarget === 'width' || this.zoomTarget === 'both') {
            this.el.nativeElement.style.width = `${this.originalWidth * factor}px`;
        }

        if (this.zoomTarget === 'height' || this.zoomTarget === 'both') {
            this.el.nativeElement.style.height = `${this.originalHeight * factor}px`;
        }

        // Atualiza as dimensões originais se o zoom for resetado para 100%
        if (this.zoomLevel === 100) {
            this.originalWidth = this.el.nativeElement.offsetWidth;
            this.originalHeight = this.el.nativeElement.offsetHeight;
        }
    }
}