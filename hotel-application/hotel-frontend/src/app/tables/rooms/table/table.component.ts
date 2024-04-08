import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HotelRoom} from "../../../../models/entities/HotelRoom";
import {PaginationPage} from "../../../../models/PaginationPage";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})
export class TableComponent {

    // данные
    @Input() items: HotelRoom[] = [];

    // индикатор загрузки данных
    @Input() isLoading: boolean = false;

    // событие выбора элемента
    @Output() onSelectItem: EventEmitter<HotelRoom> = new EventEmitter<HotelRoom>();

    // событие выбора страницы пагинации
    @Output() onSelectPage: EventEmitter<number> = new EventEmitter<number>();

    // информация о текущей странице
    @Input() paginationPage: PaginationPage = new PaginationPage();
}
