import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CleaningHistoryRoutingModule} from './cleaning-history-routing.module';
import {TableComponent} from './table/table.component';
import {CleaningHistoryComponent} from './cleaning-history.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "../../assets/pagination/pagination.module";


@NgModule({
    declarations: [
        TableComponent,
        CleaningHistoryComponent
    ],
    imports: [
        CommonModule,
        CleaningHistoryRoutingModule,
        ReactiveFormsModule,
        PaginationModule
    ]
})
export class CleaningHistoryModule {
}
