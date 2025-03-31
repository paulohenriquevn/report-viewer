import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportParameter } from '../../models/report-config.model';

@Component({
    selector: 'app-report-parameters',
    templateUrl: './report-parameters.component.html',
    styleUrls: ['./report-parameters.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ReportParametersComponent implements OnInit, OnChanges {
    @Input() parameters: ReportParameter[] = [];
    @Output() parametersChange = new EventEmitter<{ [key: string]: any }>();

    paramValues: { [key: string]: any } = {};

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
                initialValues[param.name] = param.defaultValue ?? '';
            });
            this.paramValues = initialValues;
        }
    }

    onParamChange(paramName: string, value: any): void {
        this.paramValues[paramName] = value;
        this.parametersChange.emit(this.paramValues);
    }
}