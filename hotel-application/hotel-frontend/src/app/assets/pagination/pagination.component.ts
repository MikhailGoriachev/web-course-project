import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Link} from "../../../models/Link";
import {PaginationPage} from "../../../models/PaginationPage";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnInit {

    // информация странице пагинации
    @Input() paginationPage: PaginationPage = new PaginationPage();

    // обработчик загрузки данных
    @Output() onSelectPage: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit(): void {
    }

    public getData(page: number) {
        if (page == -1)
            return;

        this.onSelectPage.emit(page);
    }
}
