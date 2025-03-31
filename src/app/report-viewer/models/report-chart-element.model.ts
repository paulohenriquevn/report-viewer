export interface ReportChartElement {
    type: 'chart';
    title?: string;
    dataSource: string;
    chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
    height?: number;
    width?: number;
    titleFontSize?: number;
    fontFamily?: string;
    xAxis: string;
    yAxis?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    series: ChartSeries[];

    // Opções específicas do ApexCharts
    stacked?: boolean;
    horizontal?: boolean;  // Para gráficos de barras
    columnWidth?: string;  // Para gráficos de barras (ex: '70%')

    // Opções para gráficos de linha e área
    curve?: 'smooth' | 'straight' | 'stepline';
    lineWidth?: number;
    markerSize?: number;

    // Opções para gráficos de pizza
    donutSize?: string;  // Tamanho do furo central para gráficos de rosca (ex: '50%')

    // Opções avançadas
    enableZoom?: boolean;
    enablePan?: boolean;
    enableExport?: boolean;
    enableDataLabels?: boolean;

    // Opções de estilo
    backgroundColor?: string;
    gridColor?: string;
    theme?: 'light' | 'dark';

    // Formatação de valores
    valueFormatter?: string;  // Template de formatação (ex: "R$ {value}")

    // Opções de responsividade
    responsive?: boolean;
}

export interface ChartSeries {
    name: string;
    dataKey: string;
    color?: string;
    type?: 'line' | 'column' | 'area'; // Para gráficos mistos
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    fillOpacity?: number; // Para áreas (0-1)
}