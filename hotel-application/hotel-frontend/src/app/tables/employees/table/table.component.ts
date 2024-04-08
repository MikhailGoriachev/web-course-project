import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaginationPage} from "../../../../models/PaginationPage";
import {Employee} from "../../../../models/entities/Employee";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})
export class TableComponent {

    // данные
    @Input() items: Employee[] = [];

    // индикатор загрузки данных
    @Input() isLoading: boolean = false;

    // событие выбора элемента
    @Output() onSelectItem: EventEmitter<Employee> = new EventEmitter<Employee>();

    // событие выбора элемента для добавления элемента
    @Output() onCreateItem: EventEmitter<void> = new EventEmitter<void>();

    // событие выбора страницы пагинации
    @Output() onSelectPage: EventEmitter<number> = new EventEmitter<number>();

    // информация о текущей странице
    @Input() paginationPage: PaginationPage = new PaginationPage();
}
