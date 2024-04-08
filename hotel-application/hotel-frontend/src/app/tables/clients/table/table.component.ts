import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from "../../../../models/entities/Client";
import 'flowbite';
import {PaginationPage} from "../../../../models/PaginationPage";


@Component({
    selector: 'app-table',
    templateUrl: './table.component.html'
})
export class TableComponent {

    // данные
    @Input() items: Client[] = [];

    // индикатор загрузки данных
    @Input() isLoading: boolean = false;

    // событие выбора элемента
    @Output() onSelectItem: EventEmitter<Client> = new EventEmitter<Client>();

    // событие выбора элемента для добавления элемента
    @Output() onCreateItem: EventEmitter<void> = new EventEmitter<void>();

    // событие выбора страницы пагинации
    @Output() onSelectPage: EventEmitter<number> = new EventEmitter<number>();

    // информация о текущей странице
    @Input() paginationPage: PaginationPage = new PaginationPage();
}
