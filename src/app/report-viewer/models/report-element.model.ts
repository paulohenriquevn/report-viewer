export interface ReportBaseElement {
    type: 'text' | 'table' | 'chart' | 'image' | 'pageBreak';
}

export interface ReportTextElement extends ReportBaseElement {
    type: 'text';
    content: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    style?: any;
}

export interface ReportTableElement extends ReportBaseElement {
    type: 'table';
    dataSource: string;
    showHeader?: boolean;
    headerFontSize?: number;
    fontSize?: number;
    headerStyle?: any;
    cellStyle?: any;
    zebraStripe?: boolean;
    zebraColor?: string;
    columns: {
        field: string;
        header: string;
        width?: number;
        format?: string;
    }[];
}

export interface ReportChartElement extends ReportBaseElement {
    type: 'chart';
    dataSource: string;
    chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
    title?: string;
    xAxis: string;
    series: any[];
    height?: number;
    width?: number;
    fontFamily?: string;
    titleFontSize?: number;
    xAxisLabel?: string;
    yAxisLabel?: string;
    horizontal?: boolean;
    columnWidth?: string;
    donutSize?: string;
    curve?: string;
    lineWidth?: number;
    markerSize?: number;
}

export interface ReportImageElement extends ReportBaseElement {
    type: 'image';
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    style?: any;
}

export interface ReportPageBreakElement extends ReportBaseElement {
    type: 'pageBreak';
}

export type ReportElement = 
    | ReportTextElement 
    | ReportTableElement 
    | ReportChartElement 
    | ReportImageElement 
    | ReportPageBreakElement;