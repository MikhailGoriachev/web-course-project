import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RoomsRoutingModule} from './rooms-routing.module';
import {TableComponent} from './table/table.component';
import {FormComponent} from './form/form.component';
import {RoomsComponent} from './rooms.component';
import {ClientsModule} from "../clients/clients.module";
import {ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "../../assets/pagination/pagination.module";


@NgModule({
    declarations: [
        TableComponent,
        FormComponent,
        RoomsComponent
    ],
    imports: [
        CommonModule,
        RoomsRoutingModule,
        ClientsModule,
        ReactiveFormsModule,
        PaginationModule
    ]
})
export class RoomsModule {
}
