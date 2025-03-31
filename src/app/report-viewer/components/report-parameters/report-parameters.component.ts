import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ReportParameter } from '../../models/report-config.model';

@Component({
    selector: 'app-report-parameters',
    templateUrl: './report-parameters.component.html',
    styleUrls: ['./report-parameters.component.scss']
})
export class ReportParametersComponent implements OnInit, OnChanges {
    @Input() parameters: ReportParameter[] = [];
    @Output() parametersChange = new EventEmitter<{ [key: string]: any }>();

    paramValues: { [key: string]: any } = {};
    errors: { [key: string]: string | null } = {};
    isExpanded: boolean = true;

    constructor() { }

    ngOnInit(): void {
        this.initializeParameterValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['parameters']) {
            this.initializeParameterValues();
        }
    }

    private initializeParameterValues(): void {
        if (this.parameters && this.parameters.length > 0) {
            const initialValues: { [key: string]: any } = {};
            this.parameters.forEach(param => {
                initialValues[param.name] = param.defaultValue !== undefined ? param.defaultValue : '';
            });
            this.paramValues = initialValues;
        }
    }

    handleParamChange(paramName: string, value: any): void {
        this.paramValues[paramName] = value;

        // Encontrar o parâmetro
        const param = this.parameters.find(p => p.name === paramName);
        if (param) {
            // Validar o valor
            const error = this.validateParameter(param, value);
            this.errors = { ...this.errors, [paramName]: error };
        }
    }

    validateParameter(param: ReportParameter, value: any): string | null {
        if (param.required && (value === undefined || value === null || value === '')) {
            return `O parâmetro ${param.label || param.name} é obrigatório`;
        }

        if (param.type === 'number' && value !== '' && isNaN(Number(value))) {
            return `O valor deve ser um número`;
        }

        if (param.type === 'date' && value !== '' && isNaN(Date.parse(value))) {
            return `O valor deve ser uma data válida`;
        }

        if (param.minValue !== undefined && Number(value) < param.minValue) {
            return `O valor deve ser maior ou igual a ${param.minValue}`;
        }

        if (param.maxValue !== undefined && Number(value) > param.maxValue) {
            return `O valor deve ser menor ou igual a ${param.maxValue}`;
        }

        return null;
    }

    applyParameters(): void {
        // Verifica se há erros
        const hasErrors = Object.values(this.errors).some(error => error !== null);
        if (hasErrors) {
            return;
        }

        this.parametersChange.emit(this.paramValues);
    }

    hasAnyError(): boolean {
        return Object.values(this.errors).some(error => error !== null);
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
    }
}