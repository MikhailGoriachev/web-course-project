import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegistrationsRoutingModule} from './registrations-routing.module';
import {TableComponent} from './table/table.component';
import {FormComponent} from './form/form.component';
import {RegistrationsComponent} from './registrations.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "../../assets/pagination/pagination.module";


@NgModule({
    declarations: [
        TableComponent,
        FormComponent,
        RegistrationsComponent
    ],
    imports: [
        CommonModule,
        RegistrationsRoutingModule,
        ReactiveFormsModule,
        PaginationModule
    ]
})
export class RegistrationsModule {
}
