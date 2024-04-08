import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: "clients",
        loadChildren: () => import("./clients/clients.module").then(m => m.ClientsModule)
    },
    {
        path: "rooms",
        loadChildren: () => import("./rooms/rooms.module").then(m => m.RoomsModule)
    },
    {
        path: "registrations",
        loadChildren: () => import("./registrations/registrations.module").then(m => m.RegistrationsModule)
    },
    {
        path: "employees",
        loadChildren: () => import("./employees/employees.module").then(m => m.EmployeesModule)
    },
    {
        path: "cleaning-history",
        loadChildren: () => import("./cleaning-history/cleaning-history.module").then(m => m.CleaningHistoryModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TablesRoutingModule {
}
