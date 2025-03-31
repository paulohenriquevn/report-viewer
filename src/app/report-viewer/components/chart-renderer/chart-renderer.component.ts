import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import { ReportChartElement } from '../../models/report-element.model';
import { ReportElement as ConfigReportElement } from '../../models/report-config.model';

@Component({
    selector: 'app-chart-renderer',
    templateUrl: './chart-renderer.component.html',
    styleUrls: ['./chart-renderer.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ChartRendererComponent implements OnChanges, AfterViewInit {
    @Input() chartElement!: ReportChartElement | ConfigReportElement;
    @Input() chartData: any[] = [];
    @Input() zoomLevel: number = 100;

    @ViewChild('chartContainer') chartContainer!: ElementRef;

    private chart!: ApexCharts;
    private chartOptions: any;
    private chartCreated: boolean = false;

    constructor() { }

    ngAfterViewInit(): void {
        this.initializeChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['chartElement'] || changes['chartData']) && this.chartContainer?.nativeElement) {
            this.initializeChart();
        }

        if (changes['zoomLevel'] && this.chart) {
            // Atualiza dimensões do gráfico quando o zoom muda
            this.updateChartDimensions();
        }
    }

    private initializeChart(): void {
        if (!this.chartElement || !this.chartData || !this.chartContainer?.nativeElement) {
            return;
        }

        this.prepareChartOptions();

        if (this.chartCreated && this.chart) {
            // Atualiza as opções se o gráfico já existir
            this.chart.updateOptions(this.chartOptions);
        } else {
            // Cria um novo gráfico
            if (this.chart) {
                this.chart.destroy();
            }

            this.chart = new ApexCharts(
                this.chartContainer.nativeElement,
                this.chartOptions
            );

            this.chart.render();
            this.chartCreated = true;
        }
    }

    private prepareChartOptions(): void {
        // Configurações básicas
        const baseOptions = {
            chart: {
                height: (this.chartElement.height || 300) * this.zoomLevel / 100,
                fontFamily: this.chartElement.fontFamily || 'Arial, sans-serif',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                },
                animations: {
                    enabled: true
                }
            },
            title: {
                text: this.chartElement.title || '',
                align: 'center',
                style: {
                    fontSize: `${(this.chartElement.titleFontSize || 16)}px`,
                    fontFamily: this.chartElement.fontFamily || 'Arial, sans-serif'
                }
            },
            tooltip: {
                enabled: true
            },
            legend: {
                show: true
            },
            colors: this.getChartColors(),
            grid: {
                show: true
            }
        };

        // Preparar opções específicas para cada tipo de gráfico
        switch (this.chartElement.chartType) {
            case 'pie':
                this.preparePieChartOptions(baseOptions);
                break;
            case 'bar':
                this.prepareBarChartOptions(baseOptions);
                break;
            case 'line':
                this.prepareLineChartOptions(baseOptions);
                break;
            case 'area':
                this.prepareAreaChartOptions(baseOptions);
                break;
            case 'scatter':
                this.prepareScatterChartOptions(baseOptions);
                break;
            default:
                console.error(`Tipo de gráfico não suportado: ${this.chartElement.chartType}`);
        }

        this.chartOptions = baseOptions;
    }

    private preparePieChartOptions(options: any): void {
        const xAxisField = this.chartElement.xAxis;
        const valueField = this.chartElement.series[0].dataKey;

        options.chart.type = 'pie';
        options.labels = this.chartData.map(item => item[xAxisField]);
        options.series = this.chartData.map(item => item[valueField]);

        options.plotOptions = {
            pie: {
                donut: {
                    size: this.chartElement.donutSize || '0%'
                }
            }
        };
    }

    private prepareBarChartOptions(options: any): void {
        options.chart.type = 'bar';

        // Preparar dados para gráfico de barras
        options.xaxis = {
            categories: this.chartData.map(item => item[this.chartElement.xAxis]),
            title: {
                text: this.chartElement.xAxisLabel || ''
            }
        };

        options.yaxis = {
            title: {
                text: this.chartElement.yAxisLabel || ''
            }
        };

        options.series = this.chartElement.series.map((serie: any) => ({
            name: serie.name,
            data: this.chartData.map(item => item[serie.dataKey])
        }));

        options.plotOptions = {
            bar: {
                horizontal: this.chartElement.horizontal || false,
                columnWidth: this.chartElement.columnWidth || '70%',
                distributed: this.chartElement.series.length === 1
            }
        };
    }

    private prepareLineChartOptions(options: any): void {
        options.chart.type = 'line';

        // Preparar dados para gráfico de linha
        options.xaxis = {
            categories: this.chartData.map(item => item[this.chartElement.xAxis]),
            title: {
                text: this.chartElement.xAxisLabel || ''
            }
        };

        options.yaxis = {
            title: {
                text: this.chartElement.yAxisLabel || ''
            }
        };

        options.series = this.chartElement.series.map((serie: any) => ({
            name: serie.name,
            data: this.chartData.map(item => item[serie.dataKey])
        }));

        options.stroke = {
            curve: this.chartElement.curve || 'straight',
            width: this.chartElement.lineWidth || 3
        };

        options.markers = {
            size: this.chartElement.markerSize || 4
        };
    }

    private prepareAreaChartOptions(options: any): void {
        options.chart.type = 'area';

        // Preparar dados para gráfico de área
        options.xaxis = {
            categories: this.chartData.map(item => item[this.chartElement.xAxis]),
            title: {
                text: this.chartElement.xAxisLabel || ''
            }
        };

        options.yaxis = {
            title: {
                text: this.chartElement.yAxisLabel || ''
            }
        };

        options.series = this.chartElement.series.map((serie: any) => ({
            name: serie.name,
            data: this.chartData.map(item => item[serie.dataKey])
        }));

        options.stroke = {
            curve: this.chartElement.curve || 'smooth',
            width: this.chartElement.lineWidth || 2
        };

        options.fill = {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.5,
                opacityFrom: 0.7,
                opacityTo: 0.2
            }
        };
    }

    private prepareScatterChartOptions(options: any): void {
        options.chart.type = 'scatter';

        if (this.chartElement.series.length < 2) {
            console.error('Scatter chart requires at least 2 series (x and y)');
            return;
        }

        const xField = this.chartElement.series[0].dataKey;
        const yField = this.chartElement.series[1].dataKey;
        const seriesName = this.chartElement.series[1].name;

        // Preparar dados para gráfico de dispersão
        options.xaxis = {
            type: 'numeric',
            title: {
                text: this.chartElement.xAxisLabel || this.chartElement.series[0].name || ''
            }
        };

        options.yaxis = {
            title: {
                text: this.chartElement.yAxisLabel || this.chartElement.series[1].name || ''
            }
        };

        // Se houver uma terceira série, usá-la para tamanho de pontos
        let sizeField = '';
        if (this.chartElement.series.length > 2) {
            sizeField = this.chartElement.series[2].dataKey;
        }

        options.series = [{
            name: seriesName,
            data: this.chartData.map(item => ({
                x: item[xField],
                y: item[yField],
                z: sizeField ? item[sizeField] : 10
            }))
        }];

        options.markers = {
            size: sizeField ? [5, 15] : this.chartElement.markerSize || 8
        };
    }

    private getChartColors(): string[] {
        // Usa cores definidas no elemento do gráfico, se disponíveis
        if (this.chartElement.series && this.chartElement.series.some((series: any) => series.color)) {
            return this.chartElement.series
                .filter((series: any) => series.color !== undefined)
                .map((series: any) => series.color as string);
        }

        // Caso contrário, usa cores padrão
        return [
            '#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12',
            '#1abc9c', '#34495e', '#16a085', '#27ae60', '#8e44ad'
        ];
    }

    private updateChartDimensions(): void {
        if (!this.chartElement || !this.chart) return;

        const height = (this.chartElement.height || 300) * this.zoomLevel / 100;

        this.chart.updateOptions({
            chart: {
                height: height
            }
        });
    }

    ngOnDestroy(): void {
        // Limpar recursos quando o componente for destruído
        if (this.chart) {
            this.chart.destroy();
        }
    }
}