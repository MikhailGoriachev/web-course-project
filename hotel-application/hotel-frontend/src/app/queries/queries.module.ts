import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QueriesRoutingModule} from './queries-routing.module';
import {QueriesComponent} from './queries.component';
import {ReportByDateRangeComponent} from './report-by-date-range/report-by-date-range.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        QueriesComponent,
        ReportByDateRangeComponent
    ],
    imports: [
        CommonModule,
        QueriesRoutingModule,
        ReactiveFormsModule
    ]
})
export class QueriesModule {
}
