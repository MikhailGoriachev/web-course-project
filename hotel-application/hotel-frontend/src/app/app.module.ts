import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DataService} from "./services/data.service";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MainComponent} from './main/main.component';
import {TablesRoutingModule} from "./tables/tables-routing.module";
import {ReactiveFormsModule} from "@angular/forms";
import {QueriesRoutingModule} from "./queries/queries-routing.module";
import {QueriesModule} from "./queries/queries.module";

@NgModule({
    declarations: [
        AppComponent,
        MainComponent
    ],
    imports: [
        TablesRoutingModule,
        QueriesModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
    ],
    providers: [DataService, HttpClient],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
