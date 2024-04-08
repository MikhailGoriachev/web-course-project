import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CleaningHistoryComponent} from "./cleaning-history.component";

const routes: Routes = [
    {path: "", component: CleaningHistoryComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CleaningHistoryRoutingModule {
}
