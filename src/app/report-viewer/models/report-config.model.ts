export interface ReportConfig {
    reportName: string;
    author?: string;
    createdAt?: string;
    version?: string;
    dataSource: string;
    preferences?: {
        defaultZoom?: number;
        defaultPageSize?: string;
        defaultOrientation?: 'portrait' | 'landscape';
        defaultFont?: string;
        exportFormats?: string[];
        enableSearch?: boolean;
        enableAnnotations?: boolean;
        template?: string;
    };
    parameters?: ReportParameter[];
    pages: ReportPage[];
}

export interface ReportPage {
    name: string;
    width?: number;
    height?: number;
    margins?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    fontFamily?: string;
    elements: ReportElement[];
}

export interface ReportElement {
    type: 'text' | 'table' | 'chart' | 'image' | 'pageBreak';
    [key: string]: any;
}

export interface ReportParameter {
    name: string;
    label?: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio';
    required?: boolean;
    defaultValue?: any;
    placeholder?: string;
    description?: string;
    readOnly?: boolean;
    minValue?: number;
    maxValue?: number;
    step?: number;
    minDate?: string;
    maxDate?: string;
    options?: {
        value: any;
        label?: string;
    }[];
    checkboxLabel?: string;
}