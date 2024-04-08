import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginationPage} from "../../../../models/PaginationPage";
import {RegistrationHotelHistory} from "../../../../models/entities/RegistrationHotelHistory";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})
export class TableComponent {

    // данные
    @Input() items: RegistrationHotelHistory[] = [];

    // индикатор загрузки данных
    @Input() isLoading: boolean = false;

    // событие выбора элемента
    @Output() onSelectItem: EventEmitter<RegistrationHotelHistory> = new EventEmitter<RegistrationHotelHistory>();

    // событие выбора элемента для добавления элемента
    @Output() onCreateItem: EventEmitter<void> = new EventEmitter<void>();

    // событие выбора страницы пагинации
    @Output() onSelectPage: EventEmitter<number> = new EventEmitter<number>();

    // информация о текущей странице
    @Input() paginationPage: PaginationPage = new PaginationPage();
}
