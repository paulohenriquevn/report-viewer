export interface ReportTextElement {
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

export interface ReportTableElement {
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

export interface ReportImageElement {
    type: 'image';
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    style?: any;
}