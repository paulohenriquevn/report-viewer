import { Component, Input, OnChanges } from '@angular/core';
import { ReportImageElement } from '../../models/report-element.model';

@Component({
    selector: 'app-image-renderer',
    templateUrl: './image-renderer.component.html',
    styleUrls: ['./image-renderer.component.scss']
})
export class ImageRendererComponent implements OnChanges {
    @Input() imageElement: ReportImageElement;
    @Input() zoomLevel: number = 100;

    imageWidth: string;
    imageHeight: string;
    imageStyle: any = {};
    isLoading: boolean = true;
    hasError: boolean = false;

    ngOnChanges(): void {
        this.updateImageDimensions();
    }

    private updateImageDimensions(): void {
        if (!this.imageElement) return;

        // Aplica o zoom às dimensões
        if (this.imageElement.width) {
            this.imageWidth = `${this.imageElement.width * this.zoomLevel / 100}px`;
        } else {
            this.imageWidth = 'auto';
        }

        if (this.imageElement.height) {
            this.imageHeight = `${this.imageElement.height * this.zoomLevel / 100}px`;
        } else {
            this.imageHeight = 'auto';
        }

        // Combina com os estilos definidos no elemento
        this.imageStyle = {
            width: this.imageWidth,
            height: this.imageHeight,
            maxWidth: '100%',
            ...(this.imageElement.style || {})
        };
    }

    onImageLoad(): void {
        this.isLoading = false;
        this.hasError = false;
    }

    onImageError(): void {
        this.isLoading = false;
        this.hasError = true;
    }
}