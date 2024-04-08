import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ClientsRoutingModule} from './clients-routing.module';
import {TableComponent} from './table/table.component';
import {ClientsComponent} from './clients.component';
import {FormComponent} from './form/form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "../../assets/pagination/pagination.module";


@NgModule({
    declarations: [
        TableComponent,
        ClientsComponent,
        FormComponent
    ],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        ReactiveFormsModule,
        PaginationModule
    ]
})
export class ClientsModule {
}
