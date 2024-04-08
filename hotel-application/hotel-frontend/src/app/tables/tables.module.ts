import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TablesRoutingModule} from './tables-routing.module';
import {DataService} from "../services/data.service";
import {ClientsModule} from "./clients/clients.module";
import {RoomsModule} from "./rooms/rooms.module";
import {RegistrationsModule} from "./registrations/registrations.module";
import { TablesComponent } from './tables.component';


@NgModule({
    declarations: [
    TablesComponent
  ],
    imports: [
        CommonModule,
        TablesRoutingModule,
        ClientsModule,
        RoomsModule,
        RegistrationsModule
    ],
    providers: [
        DataService
    ]
})
export class TablesModule {
}
