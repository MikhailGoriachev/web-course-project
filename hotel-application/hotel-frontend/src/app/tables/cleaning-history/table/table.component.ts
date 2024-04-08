import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaginationPage} from "../../../../models/PaginationPage";
import {CleaningHistory} from "../../../../models/entities/CleaningHistory";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})
export class TableComponent {

    // данные
    @Input() items: CleaningHistory[] = [];

    // индикатор загрузки данных
    @Input() isLoading: boolean = false;

    // событие выбора страницы пагинации
    @Output() onSelectPage: EventEmitter<number> = new EventEmitter<number>();

    // информация о текущей странице
    @Input() paginationPage: PaginationPage = new PaginationPage();
}
