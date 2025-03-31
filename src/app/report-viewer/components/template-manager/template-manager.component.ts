import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TemplateService } from '../../services/template.service';
import { ReportTemplate } from '../../models/report-template.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-template-manager',
    templateUrl: './template-manager.component.html',
    styleUrls: ['./template-manager.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TemplateManagerComponent implements OnInit {
    @Input() selectedTemplate: string = '';
    @Input() templates: { id: string, name: string, description?: string }[] = [];
    @Output() templateSelected = new EventEmitter<string>();

    localTemplates: { id: string, name: string, description?: string }[] = [];
    isExpanded: boolean = false;

    constructor(private templateService: TemplateService) { }

    ngOnInit(): void {
        if (this.templates && this.templates.length > 0) {
            this.localTemplates = [...this.templates];
        } else {
            this.loadTemplates();
        }
    }

    async loadTemplates(): Promise<void> {
        try {
            this.localTemplates = await this.templateService.getTemplatesList();
        } catch (err) {
            console.error('Erro ao carregar templates:', err);
        }
    }

    selectTemplate(templateId: string): void {
        this.selectedTemplate = templateId;
        this.templateSelected.emit(templateId);
        this.isExpanded = false;
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
    }

    getSelectedTemplateName(): string {
        const template = this.localTemplates.find(t => t.id === this.selectedTemplate);
        return template ? template.name : 'Padrão';
    }
}