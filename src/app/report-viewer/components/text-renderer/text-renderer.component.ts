import { Component, Input, OnChanges } from '@angular/core';
import { ReportTextElement } from '../../models/report-element.model';
import { CommonModule } from '@angular/common';
import { HighlightSearchDirective } from '../../directives/highlight-search.directive';

@Component({
    selector: 'app-text-renderer',
    templateUrl: './text-renderer.component.html',
    styleUrls: ['./text-renderer.component.scss'],
    standalone: true,
    imports: [CommonModule, HighlightSearchDirective]
})
export class TextRendererComponent implements OnChanges {
    @Input() textElement!: ReportTextElement;
    @Input() zoomLevel: number = 100;
    @Input() searchTerm: string = '';

    textStyle: any = {};

    ngOnChanges(): void {
        this.updateTextStyle();
    }

    private updateTextStyle(): void {
        if (!this.textElement) return;

        this.textStyle = {
            fontSize: this.textElement.fontSize ? `${this.textElement.fontSize * this.zoomLevel / 100}px` : null,
            fontWeight: this.textElement.bold ? 'bold' : null,
            fontStyle: this.textElement.italic ? 'italic' : null,
            textDecoration: this.textElement.underline ? 'underline' : null,
            color: this.textElement.color || null,
            textAlign: this.textElement.align || null,
            ...this.textElement.style
        };
    }
}