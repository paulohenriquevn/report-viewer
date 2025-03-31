import { NgModule } from "@angular/core";
import { FormatValuePipe } from "./format-value.pipe";
import { SafeHtmlPipe } from "./safe-html.pipe";

@NgModule({
    declarations: [
        SafeHtmlPipe,
        FormatValuePipe
    ],
    exports: [
        SafeHtmlPipe,
        FormatValuePipe
    ]
})
export class PipesModule { }