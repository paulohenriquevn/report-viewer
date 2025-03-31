import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ReportTemplate } from '../models/report-template.model';
import { ReportConfig } from '../models/report-config.model';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private templates: { [key: string]: ReportTemplate } = {
        modern: {
            id: 'modern',
            name: 'Modern',
            description: 'Template com design moderno e limpo',
            colors: {
                primary: '#3498db',
                secondary: '#2ecc71',
                accent: '#9b59b6',
                text: '#34495e',
                background: '#ffffff',
                headerBg: '#f8f9fa'
            },
            fonts: {
                heading: 'Roboto, sans-serif',
                body: 'Open Sans, sans-serif'
            },
            styles: {
                headings: {
                    fontSize: {
                        h1: 24,
                        h2: 20,
                        h3: 18
                    },
                    color: '#2c3e50',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                },
                tables: {
                    headerBg: '#f8f9fa',
                    headerColor: '#2c3e50',
                    borderColor: '#ecf0f1',
                    zebraStripe: true,
                    zebraColor: '#f9f9f9'
                },
                charts: {
                    colors: ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'],
                    fontFamily: 'Open Sans, sans-serif',
                    fontSize: 12
                }
            }
        },
        corporate: {
            id: 'corporate',
            name: 'Corporate',
            description: 'Template formal para relatórios corporativos',
            colors: {
                primary: '#0F52BA',
                secondary: '#4169E1',
                accent: '#1E90FF',
                text: '#333333',
                background: '#ffffff',
                headerBg: '#f0f0f0'
            },
            fonts: {
                heading: 'Arial, sans-serif',
                body: 'Arial, sans-serif'
            },
            styles: {
                headings: {
                    fontSize: {
                        h1: 22,
                        h2: 18,
                        h3: 16
                    },
                    color: '#000000',
                    fontWeight: 'bold',
                    marginBottom: '12px'
                },
                tables: {
                    headerBg: '#0F52BA',
                    headerColor: '#ffffff',
                    borderColor: '#cccccc',
                    zebraStripe: false,
                    zebraColor: ''
                },
                charts: {
                    colors: ['#0F52BA', '#4169E1', '#1E90FF', '#6495ED', '#00BFFF', '#87CEEB'],
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 11
                }
            }
        },
        creative: {
            id: 'creative',
            name: 'Creative',
            description: 'Template colorido e criativo',
            colors: {
                primary: '#FF5252',
                secondary: '#FF9800',
                accent: '#536DFE',
                text: '#212121',
                background: '#FAFAFA',
                headerBg: '#EEEEEE'
            },
            fonts: {
                heading: 'Montserrat, sans-serif',
                body: 'Lato, sans-serif'
            },
            styles: {
                headings: {
                    fontSize: {
                        h1: 28,
                        h2: 22,
                        h3: 18
                    },
                    color: '#FF5252',
                    fontWeight: 'bold',
                    marginBottom: '20px'
                },
                tables: {
                    headerBg: '#FF5252',
                    headerColor: '#FFFFFF',
                    borderColor: '#EEEEEE',
                    zebraStripe: true,
                    zebraColor: '#FAFAFA'
                },
                charts: {
                    colors: ['#FF5252', '#FF9800', '#536DFE', '#9C27B0', '#4CAF50', '#03A9F4'],
                    fontFamily: 'Lato, sans-serif',
                    fontSize: 12
                }
            }
        }
    };

    constructor(private http: HttpClient) { }

    /**
     * Obtém todos os templates disponíveis
     */
    getTemplatesList(): Promise<{ id: string, name: string, description: string }[]> {
        return Promise.resolve(
            Object.keys(this.templates).map(key => ({
                id: key,
                name: this.templates[key].name,
                description: this.templates[key].description || ''
            }))
        );
    }

    /**
     * Obtém um template específico
     * @param templateId ID do template
     */
    getTemplate(templateId: string): Promise<ReportTemplate> {
        const template = this.templates[templateId];
        if (!template) {
            return Promise.reject(new Error(`Template com ID '${templateId}' não encontrado`));
        }
        return Promise.resolve({ ...template });
    }

    /**
     * Cria um novo template
     * @param template Definição do template
     */
    createTemplate(template: ReportTemplate): Promise<ReportTemplate> {
        // Validar template
        this.validateTemplate(template);

        if (this.templates[template.id]) {
            return Promise.reject(new Error(`Template com ID '${template.id}' já existe`));
        }

        this.templates[template.id] = { ...template };
        return Promise.resolve({ ...template });
    }

    /**
     * Atualiza um template existente
     * @param templateId ID do template
     * @param template Definição do template
     */
    updateTemplate(templateId: string, template: ReportTemplate): Promise<ReportTemplate> {
        // Validar template
        this.validateTemplate(template);

        if (!this.templates[templateId]) {
            return Promise.reject(new Error(`Template com ID '${templateId}' não encontrado`));
        }

        this.templates[templateId] = { ...template, id: templateId };
        return Promise.resolve({ ...template, id: templateId });
    }

    /**
     * Remove um template
     * @param templateId ID do template
     */
    deleteTemplate(templateId: string): Promise<boolean> {
        if (!this.templates[templateId]) {
            return Promise.reject(new Error(`Template com ID '${templateId}' não encontrado`));
        }

        // Não permite excluir templates padrão
        if (['modern', 'corporate', 'creative'].includes(templateId)) {
            return Promise.reject(new Error(`Não é permitido excluir templates padrão`));
        }

        delete this.templates[templateId];
        return Promise.resolve(true);
    }

    /**
     * Aplica um template a uma configuração de relatório
     * @param reportConfig Configuração do relatório
     * @param templateId ID do template
     */
    async applyTemplate(reportConfig: ReportConfig, templateId: string): Promise<ReportConfig> {
        const template = await this.getTemplate(templateId);

        // Deep clone para não modificar o original
        const newConfig: ReportConfig = JSON.parse(JSON.stringify(reportConfig));

        // Aplica configurações do template
        if (!newConfig.preferences) {
            newConfig.preferences = {};
        }

        // Aplica fontes e cores padrão
        newConfig.preferences.defaultFont = template.fonts.body;
        newConfig.preferences.template = templateId;

        // Aplica estilos às páginas
        newConfig.pages.forEach(page => {
            // Define a fonte padrão da página
            page.fontFamily = template.fonts.body;

            // Aplica estilos aos elementos
            if (page.elements) {
                page.elements.forEach(element => {
                    switch (element.type) {
                        case 'text':
                            // Verifica se é um título
                            if ((element as any).fontSize >= 18 && (element as any).bold) {
                                (element as any).fontFamily = template.fonts.heading;
                                (element as any).color = (element as any).color || template.styles.headings.color;
                            }
                            break;

                        case 'table':
                            // Aplica estilos à tabela
                            if (!(element as any).headerStyle) {
                                (element as any).headerStyle = {};
                            }
                            (element as any).headerStyle.backgroundColor = template.styles.tables.headerBg;
                            (element as any).headerStyle.color = template.styles.tables.headerColor;

                            if (!(element as any).cellStyle) {
                                (element as any).cellStyle = {};
                            }
                            (element as any).cellStyle.borderColor = template.styles.tables.borderColor;

                            if (template.styles.tables.zebraStripe) {
                                (element as any).zebraStripe = true;
                                (element as any).zebraColor = template.styles.tables.zebraColor;
                            }
                            break;

                        case 'chart':
                            // Aplica paleta de cores aos gráficos
                            if ((element as any).series) {
                                (element as any).series.forEach((serie: any, index: number) => {
                                    if (!serie.color) {
                                        serie.color = template.styles.charts.colors[index % template.styles.charts.colors.length];
                                    }
                                });
                            }
                            break;
                    }
                });
            }
        });

        return newConfig;
    }

    /**
     * Valida a estrutura de um template
     * @param template Template para validar
     */
    private validateTemplate(template: ReportTemplate): void {
        const requiredFields = ['id', 'name', 'colors', 'fonts', 'styles'];

        requiredFields.forEach(field => {
            if (!template[field as keyof ReportTemplate]) {
                throw new Error(`Campo obrigatório '${field}' ausente no template`);
            }
        });

        // Valida cores
        const requiredColors = ['primary', 'secondary', 'text', 'background'];
        requiredColors.forEach(color => {
            if (!template.colors[color as keyof typeof template.colors]) {
                throw new Error(`Cor obrigatória '${color}' ausente no template`);
            }
        });

        // Valida fontes
        if (!template.fonts.heading || !template.fonts.body) {
            throw new Error('Fontes para título e corpo são obrigatórias');
        }

        // Valida estilos
        if (!template.styles.headings || !template.styles.tables || !template.styles.charts) {
            throw new Error('Configurações de estilo incompletas no template');
        }
    }
}