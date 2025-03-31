import { NgModule } from "@angular/core";
import { HighlightSearchDirective } from "./highlight-search.directive";
import { ZoomDirective } from "./zoom.directive";

@NgModule({
    declarations: [
      HighlightSearchDirective,
      ZoomDirective
    ],
    exports: [
      HighlightSearchDirective,
      ZoomDirective
    ]
  })
  export class DirectivesModule { }