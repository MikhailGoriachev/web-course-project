import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportByDateRangeComponent} from "./report-by-date-range/report-by-date-range.component";

const routes: Routes = [
    {path: "report-by-date-range", component: ReportByDateRangeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueriesRoutingModule { }
