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