# Documentação Completa - BI Report Viewer com ApexCharts

## Sumário

1. [Introdução](#1-introdução)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Instalação e Configuração](#3-instalação-e-configuração)
4. [Componentes Principais](#4-componentes-principais)
5. [Serviços](#5-serviços)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [Formato JSON de Configuração](#7-formato-json-de-configuração)
8. [Sistema de Templates](#8-sistema-de-templates)
9. [Recursos de Visualização](#9-recursos-de-visualização)
10. [Sistema de Exportação](#10-sistema-de-exportação)
11. [Sistema de Parâmetros](#11-sistema-de-parâmetros)
12. [Diretivas e Pipes](#12-diretivas-e-pipes)
13. [Integração ApexCharts](#13-integração-apexcharts)
14. [Guia de Melhores Práticas](#14-guia-de-melhores-práticas)
15. [Solução de Problemas](#15-solução-de-problemas)
16. [Extensibilidade](#16-extensibilidade)
17. [Referências](#17-referências)

## 1. Introdução

O BI Report Viewer é uma solução avançada de visualização e geração de relatórios baseada em Angular e Tailwind CSS, com integração de gráficos usando a biblioteca ApexCharts. Esta ferramenta foi projetada para ser uma alternativa superior a soluções comerciais como Stimulsoft, JSReport e BoldReports, oferecendo mais flexibilidade, melhor desempenho e maior personalização.

### 1.1. Características Principais

- Definição de relatórios via arquivos JSON
- Sistema flexível de templates
- Visualizações de dados avançadas com ApexCharts
- Múltiplos formatos de exportação (PDF, Excel, CSV, Imagem)
- Sistema de parâmetros dinâmicos
- Interface responsiva e moderna usando Tailwind CSS
- Arquitetura modular baseada em Angular

### 1.2. Público-Alvo

Esta documentação é destinada a:
- Desenvolvedores que implementarão ou estenderão o BI Report Viewer
- Administradores de sistemas responsáveis pela configuração
- Analistas de BI que criarão configurações de relatórios

## 2. Arquitetura do Sistema

### 2.1. Visão Geral da Arquitetura

O BI Report Viewer segue uma arquitetura modular baseada em componentes, construída no framework Angular. Abaixo está uma representação de alto nível:

```
┌─────────────────────────────────────────────────────────┐
│                 Report Viewer (Angular App)              │
├─────────────┬───────────────┬────────────┬──────────────┤
│  Components │    Services   │   Models   │  Directives  │
├─────────────┴───────────────┴────────────┴──────────────┤
│                    ApexCharts Integration                │
├─────────────────────────────────────────────────────────┤
│                       Tailwind CSS                       │
└─────────────────────────────────────────────────────────┘
```

### 2.2. Estrutura de Diretórios

```
bi-report-viewer/
├── src/
│   ├── app/
│   │   ├── report-viewer/
│   │   │   ├── components/
│   │   │   │   ├── report-viewer/
│   │   │   │   ├── chart-renderer/
│   │   │   │   ├── report-parameters/
│   │   │   │   ├── table-renderer/
│   │   │   │   ├── text-renderer/
│   │   │   │   ├── image-renderer/
│   │   │   │   └── template-manager/
│   │   │   ├── services/
│   │   │   │   ├── report.service.ts
│   │   │   │   ├── template.service.ts
│   │   │   │   └── export.service.ts
│   │   │   ├── models/
│   │   │   │   ├── report-config.model.ts
│   │   │   │   ├── report-data.model.ts
│   │   │   │   ├── report-element.model.ts
│   │   │   │   └── report-template.model.ts
│   │   │   ├── directives/
│   │   │   │   ├── highlight-search.directive.ts
│   │   │   │   └── zoom.directive.ts
│   │   │   ├── pipes/
│   │   │   │   ├── safe-html.pipe.ts
│   │   │   │   └── format-value.pipe.ts
│   │   │   └── report-viewer.module.ts
│   │   └── app.module.ts
│   ├── assets/
│   │   ├── reports/
│   │   │   ├── configs/
│   │   │   └── data/
│   └── styles.css
└── tailwind.config.js
```

### 2.3. Fluxo de Dados

O sistema segue o seguinte fluxo de dados:

1. O arquivo de configuração JSON é carregado pelo `ReportService`
2. Os dados são carregados da fonte definida na configuração
3. O componente `ReportViewerComponent` renderiza o relatório com base na configuração
4. Os elementos específicos são processados por componentes especializados (tabelas, gráficos, etc.)
5. O usuário pode aplicar templates, ajustar parâmetros e exportar o relatório

## 3. Instalação e Configuração

### 3.1. Pré-requisitos

- Node.js (v14+)
- npm (v6+)
- Angular CLI (v14+)

### 3.2. Instalação

#### 3.2.1. Criar um Novo Projeto Angular

```bash
ng new bi-report-viewer
cd bi-report-viewer
```

#### 3.2.2. Instalar Dependências

```bash
npm install apexcharts ng-apexcharts
npm install tailwindcss
```

#### 3.2.3. Configurar Tailwind CSS

```bash
npx tailwindcss init
```

Edite o arquivo `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Atualize o arquivo `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 3.2.4. Atualizar o Angular.json

Adicione o CSS do ApexCharts no arquivo `angular.json`:

```json
"styles": [
  "node_modules/apexcharts/dist/apexcharts.css",
  "src/styles.css"
],
"scripts": [
  "node_modules/apexcharts/dist/apexcharts.min.js"
]
```

### 3.3. Configuração

#### 3.3.1. Importar o Módulo no AppModule

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReportViewerModule } from './report-viewer/report-viewer.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReportViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 3.3.2. Utilizar o Componente Report Viewer

Em `app.component.html`:

```html
<app-report-viewer [reportConfigPath]="'assets/reports/configs/report-config.json'"></app-report-viewer>
```

## 4. Componentes Principais

### 4.1. ReportViewerComponent

O componente principal que coordena a renderização do relatório completo.

#### 4.1.1. Responsabilidades
- Carregar a configuração do relatório
- Carregar os dados do relatório
- Gerenciar a navegação entre páginas
- Gerenciar o zoom
- Coordenar a exportação do relatório
- Aplicar templates

#### 4.1.2. Inputs
- `reportConfigPath`: Caminho para o arquivo de configuração JSON

#### 4.1.3. Uso
```html
<app-report-viewer 
  [reportConfigPath]="'assets/reports/configs/report-config.json'"
></app-report-viewer>
```

### 4.2. ChartRendererComponent

Componente especializado na renderização de gráficos usando ApexCharts.

#### 4.2.1. Responsabilidades
- Renderizar diferentes tipos de gráficos (linha, barra, pizza, etc.)
- Gerenciar opções do ApexCharts
- Aplicar zoom aos gráficos
- Formatar dados para visualização

#### 4.2.2. Inputs
- `chartElement`: Configuração do elemento de gráfico
- `chartData`: Dados para o gráfico
- `zoomLevel`: Nível de zoom atual

#### 4.2.3. Tipos de Gráficos Suportados
- Gráfico de linha
- Gráfico de barra
- Gráfico de área
- Gráfico de pizza
- Gráfico de dispersão

### 4.3. TableRendererComponent

Componente para renderização de tabelas de dados.

#### 4.3.1. Responsabilidades
- Renderizar tabelas com dados dinâmicos
- Gerenciar cabeçalhos e formatação de células
- Aplicar ordenação por coluna
- Highlighting de termos pesquisados

#### 4.3.2. Inputs
- `tableElement`: Configuração do elemento de tabela
- `tableData`: Dados para a tabela
- `zoomLevel`: Nível de zoom atual
- `searchTerm`: Termo de pesquisa para destacar

### 4.4. TemplateManagerComponent

Componente para gerenciamento de templates visuais do relatório.

#### 4.4.1. Responsabilidades
- Listar templates disponíveis
- Permitir seleção de template
- Emitir evento de mudança de template

#### 4.4.2. Inputs
- `selectedTemplate`: Template atualmente selecionado

#### 4.4.3. Outputs
- `templateSelected`: Emitido quando um novo template é selecionado

### 4.5. ReportParametersComponent

Componente para gerenciamento de parâmetros dinâmicos do relatório.

#### 4.5.1. Responsabilidades
- Renderizar controles para diferentes tipos de parâmetros
- Validar entradas de parâmetros
- Emitir alterações nos valores de parâmetros

#### 4.5.2. Inputs
- `parameters`: Lista de definições de parâmetros

#### 4.5.3. Outputs
- `parametersChange`: Emitido quando os parâmetros são alterados

## 5. Serviços

### 5.1. ReportService

Serviço principal para gerenciamento de relatórios.

#### 5.1.1. Responsabilidades
- Carregar configurações de relatórios
- Carregar dados de relatórios
- Coordenar a exportação de relatórios
- Aplicar parâmetros às fontes de dados

#### 5.1.2. Métodos Principais
- `loadReportConfig(configPath: string): Promise<ReportConfig>`
- `loadReportData(dataSource: string): Promise<ReportData>`
- `exportReport(reportConfig, reportData, format, options?): Promise<Blob>`
- `applyParameters(parameters: any): Promise<ReportData>`

### 5.2. TemplateService

Serviço para gerenciamento de templates visuais.

#### 5.2.1. Responsabilidades
- Gerenciar templates disponíveis
- Aplicar templates a configurações de relatórios
- Validar templates

#### 5.2.2. Métodos Principais
- `getTemplatesList(): Promise<TemplateSummary[]>`
- `getTemplate(templateId: string): Promise<ReportTemplate>`
- `createTemplate(template: ReportTemplate): Promise<ReportTemplate>`
- `updateTemplate(templateId, template): Promise<ReportTemplate>`
- `deleteTemplate(templateId: string): Promise<boolean>`
- `applyTemplate(reportConfig, templateId): Promise<ReportConfig>`

### 5.3. ExportService

Serviço especializado para exportação de relatórios.

#### 5.3.1. Responsabilidades
- Exportar relatórios para diferentes formatos
- Gerenciar opções de exportação
- Formatar dados conforme necessário para cada formato

#### 5.3.2. Métodos Principais
- `exportToPDF(reportConfig, reportData, options?): Promise<Blob>`
- `exportToExcel(reportConfig, reportData, options?): Promise<Blob>`
- `exportToCSV(reportConfig, reportData, options?): Promise<Blob>`
- `exportToImage(reportConfig, reportData, options?): Promise<Blob>`

## 6. Modelo de Dados

### 6.1. Configuração do Relatório

```typescript
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
```

### 6.2. Página do Relatório

```typescript
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
```

### 6.3. Elementos do Relatório

#### 6.3.1. Interface Base
```typescript
export interface ReportElement {
  type: 'text' | 'table' | 'chart' | 'image' | 'pageBreak';
  [key: string]: any;
}
```

#### 6.3.2. Elemento de Texto
```typescript
export interface ReportTextElement extends ReportElement {
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
```

#### 6.3.3. Elemento de Tabela
```typescript
export interface ReportTableElement extends ReportElement {
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
```

#### 6.3.4. Elemento de Gráfico
```typescript
export interface ReportChartElement extends ReportElement {
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
  horizontal?: boolean;
  columnWidth?: string;
  curve?: 'smooth' | 'straight' | 'stepline';
  lineWidth?: number;
  markerSize?: number;
  donutSize?: string;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableDataLabels?: boolean;
  backgroundColor?: string;
  gridColor?: string;
  theme?: 'light' | 'dark';
  valueFormatter?: string;
  responsive?: boolean;
}

export interface ChartSeries {
  name: string;
  dataKey: string;
  color?: string;
  type?: 'line' | 'column' | 'area';
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  fillOpacity?: number;
}
```

#### 6.3.5. Elemento de Imagem
```typescript
export interface ReportImageElement extends ReportElement {
  type: 'image';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  style?: any;
}
```

### 6.4. Parâmetros do Relatório

```typescript
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
```

### 6.5. Template

```typescript
export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    text: string;
    background: string;
    headerBg?: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  styles: {
    headings: {
      fontSize: {
        h1: number;
        h2: number;
        h3: number;
      };
      color: string;
      fontWeight: string;
      marginBottom: string;
    };
    tables: {
      headerBg: string;
      headerColor: string;
      borderColor: string;
      zebraStripe?: boolean;
      zebraColor?: string;
    };
    charts: {
      colors: string[];
      fontFamily: string;
      fontSize: number;
    };
  };
}
```

## 7. Formato JSON de Configuração

### 7.1. Estrutura Básica

```json
{
  "reportName": "Nome do Relatório",
  "author": "Nome do Autor",
  "createdAt": "2025-03-31T10:00:00",
  "version": "1.0",
  "dataSource": "caminho/para/dados.json",
  "preferences": {
    "defaultZoom": 100,
    "defaultPageSize": "A4",
    "defaultOrientation": "portrait",
    "template": "modern"
  },
  "parameters": [],
  "pages": []
}
```

### 7.2. Exemplo Completo

```json
{
  "reportName": "Relatório de Vendas Trimestral",
  "author": "Sistema BI",
  "createdAt": "2025-03-31T10:00:00",
  "version": "1.0",
  "dataSource": "assets/reports/data/sales-data.json",
  "preferences": {
    "defaultZoom": 100,
    "defaultPageSize": "A4",
    "defaultOrientation": "portrait",
    "defaultFont": "Arial",
    "exportFormats": ["pdf", "excel", "csv", "image"],
    "enableSearch": true,
    "enableAnnotations": true,
    "template": "modern"
  },
  "parameters": [
    {
      "name": "startDate",
      "label": "Data Início",
      "type": "date",
      "required": true,
      "defaultValue": "2025-01-01"
    },
    {
      "name": "endDate",
      "label": "Data Fim",
      "type": "date",
      "required": true,
      "defaultValue": "2025-03-31"
    },
    {
      "name": "region",
      "label": "Região",
      "type": "select",
      "options": [
        { "value": "", "label": "Todas" },
        { "value": "sul", "label": "Sul" },
        { "value": "sudeste", "label": "Sudeste" }
      ]
    }
  ],
  "pages": [
    {
      "name": "Capa",
      "width": 800,
      "height": 1100,
      "margins": {"top": 50, "right": 50, "bottom": 50, "left": 50},
      "elements": [
        {
          "type": "text",
          "content": "RELATÓRIO DE VENDAS TRIMESTRAL",
          "fontSize": 24,
          "bold": true,
          "align": "center",
          "color": "#2c3e50"
        },
        {
          "type": "image",
          "url": "/assets/images/logo.png",
          "alt": "Logo da Empresa",
          "width": 200,
          "height": 200
        }
      ]
    },
    {
      "name": "Resumo Executivo",
      "width": 800,
      "height": 1100,
      "elements": [
        {
          "type": "text",
          "content": "RESUMO EXECUTIVO",
          "fontSize": 18,
          "bold": true,
          "align": "center"
        },
        {
          "type": "chart",
          "title": "Vendas por Região",
          "chartType": "pie",
          "dataSource": "salesByRegion",
          "height": 350,
          "xAxis": "region",
          "donutSize": "55%",
          "enableDataLabels": true,
          "series": [
            {
              "dataKey": "value",
              "name": "Valor de Vendas"
            }
          ]
        },
        {
          "type": "table",
          "showHeader": true,
          "headerFontSize": 14,
          "fontSize": 12,
          "dataSource": "salesDetails",
          "columns": [
            {
              "field": "product",
              "header": "Produto"
            },
            {
              "field": "quantity",
              "header": "Quantidade"
            },
            {
              "field": "revenue",
              "header": "Receita",
              "format": "currency"
            }
          ]
        }
      ]
    }
  ]
}
```

### 7.3. Estrutura de Dados

```json
{
  "salesByRegion": [
    { "region": "Sul", "value": 1245000 },
    { "region": "Sudeste", "value": 2350000 },
    { "region": "Centro-Oeste", "value": 890000 }
  ],
  "monthlySales": [
    { "month": "Jan", "value": 1850000, "target": 1800000 },
    { "month": "Fev", "value": 2100000, "target": 1950000 },
    { "month": "Mar", "value": 2340000, "target": 2100000 }
  ],
  "salesDetails": [
    { "product": "UltraBook Pro", "category": "Premium", "region": "Sul", "quantity": 145, "revenue": 435000 }
  ]
}
```

## 8. Sistema de Templates

### 8.1. Templates Predefinidos

O sistema inclui três templates predefinidos:

#### 8.1.1. Modern
- Design limpo e moderno
- Esquema de cores: tons de azul (#3498db, #2ecc71, #9b59b6)
- Fontes: Roboto para títulos, Open Sans para corpo

#### 8.1.2. Corporate
- Estilo formal para ambientes corporativos
- Esquema de cores: tons de azul corporativo (#0F52BA, #4169E1)
- Fontes: Arial para títulos e corpo

#### 8.1.3. Creative
- Design colorido e criativo
- Esquema de cores: tons vibrantes (#FF5252, #FF9800, #536DFE)
- Fontes: Montserrat para títulos, Lato para corpo

### 8.2. Aplicação de Templates

Templates podem ser aplicados de duas maneiras:

1. **Via configuração**: Definindo o template na configuração JSON do relatório
   ```json
   "preferences": {
     "template": "modern"
   }
   ```

2. **Via interface**: Usando o componente TemplateManagerComponent para selecionar um template durante a visualização

### 8.3. Criação de Templates Personalizados

Para criar um template personalizado, use o TemplateService:

```typescript
const newTemplate: ReportTemplate = {
  id: 'custom-template',
  name: 'Template Personalizado',
  description: 'Meu template personalizado',
  colors: {
    primary: '#00796B',
    secondary: '#FFC107',
    accent: '#E64A19',
    text: '#212121',
    background: '#FFFFFF',
    headerBg: '#ECEFF1'
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Roboto, sans-serif'
  },
  styles: {
    headings: {
      fontSize: {
        h1: 26,
        h2: 22,
        h3: 18
      },
      color: '#00796B',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    tables: {
      headerBg: '#00796B',
      headerColor: '#FFFFFF',
      borderColor: '#ECEFF1',
      zebraStripe: true,
      zebraColor: '#F5F5F5'
    },
    charts: {
      colors: ['#00796B', '#FFC107', '#E64A19', '#9C27B0', '#3F51B5'],
      fontFamily: 'Roboto, sans-serif',
      fontSize: 12
    }
  }
};

templateService.createTemplate(newTemplate)
  .then(template => {
    console.log('Template criado com sucesso:', template);
  })
  .catch(error => {
    console.error('Erro ao criar template:', error);
  });
```

## 9. Recursos de Visualização

### 9.1. Tipos de Gráficos

#### 9.1.1. Gráfico de Barras
```json
{
  "type": "chart",
  "title": "Vendas por Categoria",
  "chartType": "bar",
  "dataSource": "salesByCategory",
  "height": 350,
  "xAxis": "category",
  "xAxisLabel": "Categoria",
  "yAxisLabel": "Valor (R$)",
  "columnWidth": "60%",
  "series": [
    {
      "dataKey": "value",
      "name": "Valor de Vendas",
      "color": "#2ecc71"
    }
  ]
}
```

#### 9.1.2. Gráfico de Linha
```json
{
  "type": "chart",
  "title": "Tendência de Vendas Mensais",
  "chartType": "line",
  "dataSource": "monthlySales",
  "height": 350,
  "xAxis": "month",
  "xAxisLabel": "Mês",
  "yAxisLabel": "Valor (R$)",
  "curve": "smooth",
  "lineWidth": 3,
  "markerSize": 6,
  "enableZoom": true,
  "series": [
    {
      "dataKey": "value",
      "name": "Vendas",
      "color": "#3498db"
    },
    {
      "dataKey": "target",
      "name": "Meta",
      "color": "#e74c3c",
      "lineStyle": "dashed"
    }
  ]
}
```

#### 9.1.3. Gráfico de Pizza
```json
{
  "type": "chart",
  "title": "Vendas por Região",
  "chartType": "pie",
  "dataSource": "salesByRegion",
  "height": 350,
  "xAxis": "region",
  "donutSize": "55%",
  "enableDataLabels": true,
  "series": [
    {
      "dataKey": "value",
      "name": "Valor de Vendas"
    }
  ]
}
```

#### 9.1.4. Gráfico de Área
```json
{
  "type": "chart",
  "title": "Evolução de Vendas por Canal",
  "chartType": "area",
  "dataSource": "salesByChannel",
  "height": 350,
  "curve": "smooth",
  "xAxis": "month",
  "xAxisLabel": "Mês",
  "yAxisLabel": "Valor (R$)",
  "stacked": true,
  "series": [
    {
      "dataKey": "retail",
      "name": "Varejo",
      "color": "#3498db",
      "fillOpacity": 0.7
    },
    {
      "dataKey": "online",
      "name": "Online",
      "color": "#2ecc71",
      "fillOpacity": 0.7
    }
  ]
}
```

#### 9.1.5. Gráfico de Dispersão
```json
{
  "type": "chart",
  "title": "Correlação de Preço vs. Volume de Vendas",
  "chartType": "scatter",
  "dataSource": "priceVsVolume",
  "height": 350,
  "xAxis": "price",
  "xAxisLabel": "Preço Médio (R$)",
  "yAxisLabel": "Volume de Vendas",
  "markerSize": 8,
  "enableZoom": true,
  "series": [
    {
      "dataKey": "price",
      "name": "Preço"
    },
    {
      "dataKey": "volume",
      "name": "Volume"
    },
    {
      "dataKey": "marketSize",
      "name": "Tamanho do Mercado"
    }
  ]
}
```

### 9.2. Tabelas

#### 9.2.1. Tabela Básica
```json
{
  "type": "table",
  "showHeader": true,
  "headerFontSize": 14,
  "fontSize": 12,
  "dataSource": "salesDetails",
  "columns": [
    {
      "field": "product",
      "header": "Produto"
    },
    {
      "field": "region",
      "header": "Região"
    },
    {
      "field": "quantity",
      "header": "Quantidade"
    },
    {
      "field": "revenue",
      "header": "Receita"
    }
  ]
}
```

#### 9.2.2. Tabela com Formatação
```json
{
  "type": "table",
  "showHeader": true,
  "headerFontSize": 14,
  "fontSize": 12,
  "dataSource": "salesDetails",
  "headerStyle": {
    "backgroundColor": "#f8f9fa",
    "fontWeight": "bold"
  },
  "cellStyle": {
    "padding": "8px"
  },
  "zebraStripe": true,
  "zebraColor": "#f9f9f9",
  "columns": [
    {
      "field": "product",
      "header": "Produto"
    },
    {
      "field": "quantity",
      "header": "Quantidade"
    },
    {
      "field": "revenue",
      "header": "Receita",
      "format": "currency"
    },
    {
      "field": "margin",
      "header": "Margem",
      "format": "percent"
    }
  ]
}
```

### 9.3. Elementos de Texto

#### 9.3.1. Texto Simples
```json
{
  "type": "text",
  "content": "Este é um texto simples",
  "fontSize": 12
}
```

#### 9.3.2. Texto Formatado
```json
{
  "type": "text",
  "content": "TÍTULO PRINCIPAL",
  "fontSize": 24,
  "bold": true,
  "align": "center",
  "color": "#2c3e50",
  "style": {
    "marginTop": "20px",
    "marginBottom": "20px",
    "letterSpacing": "2px"
  }
}
```

### 9.4. Imagens

#### 9.4.1. Imagem Básica
```json
{
  "type": "image",
  "url": "/assets/images/logo.png",
  "alt": "Logo da Empresa",
  "width": 200,
  "height": 200
}
```

#### 9.4.2. Imagem com Legenda
```json
{
  "type": "image",
  "url": "/assets/images/chart.png",
  "alt": "Gráfico de Análise",
  "width": 400,
  "height": 300,
  "caption": "Figura 1: Análise Comparativa de Vendas",
  "style": {
    "border": "1px solid #e0e0e0",
    "borderRadius": "4px",
    "boxShadow": "0 2px 4px rgba(0,0,0,0.1)"
  }
}
```

### 9.5. Quebra de Página

```json
{
  "type": "pageBreak"
}
```

## 10. Sistema de Exportação

### 10.1. Formatos Suportados

- **PDF**: Exportação completa preservando o layout do relatório
- **Excel**: Exportação de dados tabulares com formatação
- **CSV**: Exportação de dados tabulares em formato de texto
- **Imagem**: Captura do relatório como imagem (PNG ou JPEG)

### 10.2. Configuração de Exportação

As opções de exportação podem ser configuradas na definição do relatório:

```json
"preferences": {
  "exportFormats": ["pdf", "excel", "csv", "image"]
}
```

### 10.3. Opções de Exportação por Formato

#### 10.3.1. PDF
```typescript
const pdfOptions = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  compress: true
};

reportService.exportReport(reportConfig, reportData, 'pdf', pdfOptions);
```

#### 10.3.2. Excel
```typescript
const excelOptions = {
  includeCharts: true,
  separateSheets: true,
  sheetName: 'Relatório de Vendas'
};

reportService.exportReport(reportConfig, reportData, 'excel', excelOptions);
```

#### 10.3.3. CSV
```typescript
const csvOptions = {
  delimiter: ';',
  includeHeaders: true,
  encoding: 'utf-8'
};

reportService.exportReport(reportConfig, reportData, 'csv', csvOptions);
```

#### 10.3.4. Imagem
```typescript
const imageOptions = {
  format: 'png',
  quality: 0.9,
  scale: 2
};

reportService.exportReport(reportConfig, reportData, 'image', imageOptions);
```

## 11. Sistema de Parâmetros

### 11.1. Definição de Parâmetros

Os parâmetros são definidos na configuração do relatório:

```json
"parameters": [
  {
    "name": "startDate",
    "label": "Data Início",
    "type": "date",
    "required": true,
    "defaultValue": "2025-01-01"
  },
  {
    "name": "endDate",
    "label": "Data Fim",
    "type": "date",
    "required": true,
    "defaultValue": "2025-03-31"
  },
  {
    "name": "region",
    "label": "Região",
    "type": "select",
    "options": [
      { "value": "", "label": "Todas" },
      { "value": "sul", "label": "Sul" },
      { "value": "sudeste", "label": "Sudeste" }
    ]
  }
]
```

### 11.2. Tipos de Parâmetros

- **text**: Campo de texto simples
- **number**: Campo numérico
- **date**: Seletor de data
- **select**: Menu de seleção
- **checkbox**: Caixa de seleção (booleano)
- **radio**: Botões de opção

### 11.3. Validação de Parâmetros

O componente `ReportParametersComponent` implementa validação para os parâmetros:

- Campos obrigatórios
- Validação de tipo (número, data)
- Validação de intervalo (min/max)

### 11.4. Aplicação de Parâmetros

Os valores dos parâmetros são aplicados através do `ReportService`:

```typescript
// No componente ReportViewerComponent
onParametersChange(parameters: any): void {
  this.reportService.applyParameters(parameters)
    .then(updatedData => {
      this.reportData = updatedData;
    })
    .catch(error => {
      this.error = `Erro ao aplicar parâmetros: ${error.message}`;
    });
}
```

## 12. Diretivas e Pipes

### 12.1. Diretivas

#### 12.1.1. HighlightSearchDirective

Esta diretiva destaca termos de pesquisa em elementos de texto.

```html
<div highlightSearch [searchTerm]="searchTerm">
  Conteúdo que pode ser pesquisado
</div>
```

#### 12.1.2. ZoomDirective

Esta diretiva aplica zoom a elementos do relatório.

```html
<div appZoom [zoomLevel]="zoomLevel" [zoomTarget]="'both'">
  Conteúdo que pode receber zoom
</div>
```

### 12.2. Pipes

#### 12.2.1. SafeHtmlPipe

Este pipe permite renderizar HTML de forma segura.

```html
<div [innerHTML]="htmlContent | safeHtml"></div>
```

#### 12.2.2. FormatValuePipe

Este pipe formata valores de acordo com o tipo especificado.

```html
<span>{{ value | formatValue:'currency' }}</span>
<span>{{ value | formatValue:'percent' }}</span>
<span>{{ value | formatValue:'date' }}</span>
<span>{{ value | formatValue:'R$ {value}' }}</span>
```

## 13. Integração ApexCharts

### 13.1. Visão Geral do ApexCharts

ApexCharts é uma biblioteca moderna de gráficos JavaScript que oferece:
- Gráficos responsivos e interativos
- Ampla variedade de tipos de gráficos
- Recursos avançados como zoom, pan e exportação
- Boa performance com grandes conjuntos de dados
- Personalização extensiva

### 13.2. Configuração do ApexCharts

A configuração do ApexCharts é gerenciada internamente pelo `ChartRendererComponent`:

```typescript
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
    // ... outras configurações
  };
  
  // Configurações específicas para cada tipo de gráfico
  switch (this.chartElement.chartType) {
    case 'pie':
      this.preparePieChartOptions(baseOptions);
      break;
    case 'bar':
      this.prepareBarChartOptions(baseOptions);
      break;
    // ... outros tipos
  }
}
```

### 13.3. Opções Específicas do ApexCharts

O modelo `ReportChartElement` inclui várias opções específicas do ApexCharts:

- `stacked`: Para gráficos de barra e área empilhados
- `horizontal`: Para gráficos de barra horizontais
- `curve`: Tipo de curva para gráficos de linha ('smooth', 'straight', 'stepline')
- `lineWidth`: Espessura das linhas
- `markerSize`: Tamanho dos marcadores em gráficos de linha
- `donutSize`: Tamanho do buraco em gráficos de rosca
- `enableZoom`: Ativa/desativa zoom
- `enableDataLabels`: Ativa/desativa rótulos de dados

### 13.4. Hooks do Ciclo de Vida

O `ChartRendererComponent` gerencia o ciclo de vida dos gráficos ApexCharts:

```typescript
ngAfterViewInit(): void {
  this.initializeChart();
}

ngOnChanges(changes: SimpleChanges): void {
  if ((changes.chartElement || changes.chartData) && this.chartContainer?.nativeElement) {
    this.initializeChart();
  }
  
  if (changes.zoomLevel && this.chart) {
    this.updateChartDimensions();
  }
}

ngOnDestroy(): void {
  if (this.chart) {
    this.chart.destroy();
  }
}
```

### 13.5. Formatação Personalizada

É possível personalizar a formatação de valores nos gráficos:

```json
{
  "type": "chart",
  "chartType": "bar",
  "valueFormatter": "R$ {value}",
  "enableDataLabels": true
}
```

## 14. Guia de Melhores Práticas

### 14.1. Organização de Relatórios

- **Estrutura Modular**: Divida relatórios complexos em várias páginas
- **Nomenclatura Consistente**: Use nomes descritivos para relatórios e elementos
- **Documentação**: Adicione metadados como autor, versão e descrição

### 14.2. Otimização de Desempenho

- **Segmentação de Dados**: Limite o volume de dados por relatório
- **Paginação**: Use paginação para tabelas grandes
- **Otimização de Imagens**: Redimensione imagens para o tamanho necessário
- **Elementos Essenciais**: Inclua apenas elementos necessários para a análise

### 14.3. Design Visual

- **Consistência**: Use templates para manter estilos consistentes
- **Contraste**: Garanta contraste adequado para legibilidade
- **Espaçamento**: Use margens e espaçamento apropriados
- **Hierarquia**: Estabeleça hierarquia visual clara com tamanhos de fonte e cores

### 14.4. Gráficos Eficientes

- **Tipo Apropriado**: Escolha o tipo de gráfico mais adequado para cada dado
- **Escala Apropriada**: Use escalas que não distorçam a percepção dos dados
- **Legendas Claras**: Forneça legendas descritivas
- **Cores Significativas**: Use cores com propósito, não apenas decorativas

### 14.5. Exportação

- **Testes de Exportação**: Teste a exportação em todos os formatos suportados
- **Metadados**: Inclua metadados nos arquivos exportados
- **Quebras de Página**: Considere quebras de página para PDF
- **Formatação Consistente**: Verifique se a formatação é mantida na exportação

## 15. Solução de Problemas

### 15.1. Problemas Comuns e Soluções

#### 15.1.1. Gráficos não são renderizados
**Problema**: Gráficos aparecem em branco ou não são renderizados.

**Soluções**:
- Verifique se o ApexCharts está corretamente instalado e importado
- Verifique se o contêiner do gráfico tem altura definida
- Verifique a estrutura dos dados fornecidos ao gráfico
- Certifique-se de que os campos de dados correspondem aos definidos na configuração

#### 15.1.2. Tabelas não mostram dados
**Problema**: Tabelas aparecem vazias.

**Soluções**:
- Verifique se a fonte de dados está corretamente definida
- Verifique se os campos das colunas correspondem aos campos nos dados
- Verifique se os dados foram carregados corretamente

#### 15.1.3. Exportação falha
**Problema**: A exportação para certos formatos falha.

**Soluções**:
- Verifique se as bibliotecas necessárias estão instaladas
- Verifique permissões de navegador para download de arquivos
- Tente limitar o tamanho ou complexidade do relatório

#### 15.1.4. Problemas de renderização com zoom
**Problema**: Elementos não respondem corretamente ao zoom.

**Soluções**:
- Verifique a implementação da diretiva de zoom
- Ajuste as unidades de medida para trabalhar com zoom (use valores relativos)
- Atualize os elementos que precisam de recálculo ao aplicar zoom

### 15.2. Depuração

#### 15.2.1. Console de Desenvolvimento
Utilize o console do navegador para diagnosticar problemas:

```typescript
console.log('Configuração do relatório:', reportConfig);
console.log('Dados do relatório:', reportData);
console.log('Configuração do gráfico:', chartOptions);
```

#### 15.2.2. Depuração de Componentes
Use ferramentas de desenvolvimento do Angular para inspecionar componentes:

```bash
ng.profiler.timeChangeDetection()
```

#### 15.2.3. Depuração de Renderização
Adicione classes ou atributos de depuração aos elementos:

```html
<div 
  [attr.data-debug]="'chart-container'"
  class="debug-element"
>
  <!-- Conteúdo -->
</div>
```

## 16. Extensibilidade

### 16.1. Adicionando Novos Tipos de Elementos

Para adicionar um novo tipo de elemento ao relatório:

1. **Defina o modelo de dados**:
```typescript
export interface ReportCustomElement extends ReportElement {
  type: 'custom';
  // Propriedades específicas
  customProperty1: string;
  customProperty2: number;
}
```

2. **Crie um componente de renderização**:
```typescript
@Component({
  selector: 'app-custom-renderer',
  template: `<div class="custom-element">{{ customElement.customProperty1 }}</div>`
})
export class CustomRendererComponent {
  @Input() customElement: ReportCustomElement;
  @Input() zoomLevel: number = 100;
}
```

3. **Registre o componente no módulo**:
```typescript
@NgModule({
  declarations: [
    // ... outros componentes
    CustomRendererComponent
  ],
  // ...
})
export class ReportViewerModule { }
```

4. **Atualize o ReportViewerComponent para renderizar o novo tipo**:
```html
<!-- No template -->
<div *ngIf="element.type === 'custom'">
  <app-custom-renderer
    [customElement]="element"
    [zoomLevel]="zoomLevel"
  ></app-custom-renderer>
</div>
```

### 16.2. Integrando Novas Fontes de Dados

Para integrar novas fontes de dados:

1. **Estenda o ReportService**:
```typescript
async loadCustomData(source: string, parameters: any): Promise<any> {
  // Implementação para carregar dados de fonte personalizada
  return this.http.post('/api/custom-data', { source, parameters }).toPromise();
}
```

2. **Atualize o método de carregamento de dados**:
```typescript
async loadReportData(dataSource: string, parameters?: any): Promise<ReportData> {
  if (dataSource.startsWith('custom://')) {
    return this.loadCustomData(dataSource.substring(9), parameters);
  }
  
  // Carregamento padrão
  return firstValueFrom(this.http.get<ReportData>(dataSource));
}
```

### 16.3. Criando Novos Templates

Para criar novos templates:

1. **Defina o template**:
```typescript
const corporateTemplate: ReportTemplate = {
  id: 'corporate-blue',
  name: 'Corporate Blue',
  // ... outras propriedades
};
```

2. **Registre o template**:
```typescript
templateService.createTemplate(corporateTemplate)
  .then(template => console.log('Template criado'))
  .catch(error => console.error('Erro:', error));
```

### 16.4. Extensões de Exportação

Para adicionar novos formatos de exportação:

1. **Implemente o método de exportação no ExportService**:
```typescript
async exportToCustomFormat(
  reportConfig: ReportConfig,
  reportData: ReportData,
  options?: any
): Promise<Blob> {
  // Implementação da exportação personalizada
  // ...
  return new Blob([customData], { type: 'application/custom' });
}
```

2. **Atualize o método de exportação no ReportService**:
```typescript
async exportReport(
  reportConfig: ReportConfig,
  reportData: ReportData,
  format: string,
  options?: any
): Promise<Blob> {
  switch (format) {
    // ... formatos existentes
    case 'custom':
      return this.exportService.exportToCustomFormat(reportConfig, reportData, options);
    default:
      throw new Error(`Formato '${format}' não suportado`);
  }
}
```

## 17. Referências

### 17.1. Documentações Externas

- [Angular Documentation](https://angular.io/docs)
- [ApexCharts Documentation](https://apexcharts.com/docs/installation/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 17.2. Bibliotecas Utilizadas

- **Angular**: Framework web para construção da aplicação
- **ApexCharts**: Biblioteca de gráficos interativos
- **Tailwind CSS**: Framework CSS utilitário

### 17.3. Recursos Adicionais

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Data Visualization Best Practices](https://www.tableau.com/learn/articles/data-visualization-best-practices)
- [Responsive Design Patterns](https://developers.google.com/web/fundamentals/design-and-ux/responsive/patterns)