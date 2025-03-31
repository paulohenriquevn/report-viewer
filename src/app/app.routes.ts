import { Routes } from '@angular/router';
import { ReportViewerComponent } from './report-viewer/components/report-viewer/report-viewer.component';
// import { ReportViewerComponent } from './report-viewer/report-viewer.component';
export const routes: Routes = [
    {
        path: '',
        component: ReportViewerComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];