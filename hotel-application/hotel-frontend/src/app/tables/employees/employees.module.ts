import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeesRoutingModule} from './employees-routing.module';
import {EmployeesComponent} from './employees.component';
import {TableComponent} from './table/table.component';
import {FormComponent} from './form/form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PaginationModule} from "../../assets/pagination/pagination.module";


@NgModule({
    declarations: [
        EmployeesComponent,
        TableComponent,
        FormComponent
    ],
    imports: [
        CommonModule,
        EmployeesRoutingModule,
        ReactiveFormsModule,
        PaginationModule,
        FormsModule
    ]
})
export class EmployeesModule {
}
