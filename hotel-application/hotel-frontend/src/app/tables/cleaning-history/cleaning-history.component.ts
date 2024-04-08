import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {PaginationPage} from "../../../models/PaginationPage";
import {DataService} from "../../services/data.service";
import {CleaningHistory} from "../../../models/entities/CleaningHistory";
import {CleaningHistoryFilter} from "../../../models/filters/CleaningHistoryFilter";
import {Utils} from "../../../utilities/Utils";
import {Floor} from "../../../models/entities/Floor";
import {Employee} from "../../../models/entities/Employee";
import {HotelRoom} from "../../../models/entities/HotelRoom";

@Component({
    selector: 'app-cleaning-history',
    templateUrl: './cleaning-history.component.html'
})
export class CleaningHistoryComponent implements OnInit {

    // данные
    public cleanings: CleaningHistory[] = [];

    // индикатор загрузки таблицы
    public isLoading: boolean = false;

    // объект выборки
    public filterCleaning = new CleaningHistoryFilter();

    // этажи
    public floors: Floor[] = [];

    // служащие
    public employees: Employee[] = [];

    // список номеров
    rooms: HotelRoom[] = [];

    // утилиты
    Utils = Utils;

    // форма для фильтра
    formSearchBy: FormGroup = this._fb.group({
        floorId: [null],
        dateCleaning: [null],
        employeeId: [null],
        roomId: [null]
    });

    // информация о текущей странице
    public paginationPage: PaginationPage = new PaginationPage();


    // конструктор
    constructor(private _data: DataService, private _fb: FormBuilder) {
        this.cleanings = [];
    }

    // событие инициализация компонента
    ngOnInit(): void {
        this.getData();

        // получение данных об этажах
        this._data.floorsGetAll().subscribe(d => this.floors = d);

        // получение данных о служащий
        this._data.employeesGetWithTrashedAll().subscribe(d => this.employees = d);

        // получение данных о номерах
        this._data.roomsGetAll().subscribe(d => this.rooms = d);
    }

    // получение данных с сервера
    public getData(page: number = 0) {
        this.isLoading = true;

        this._data.cleaningHistoriesIndex(page, this.filterCleaning)
            .subscribe(o => {
                this.cleanings = o.data.map((d: any) => CleaningHistory.fromJson(Utils.convertSnakeToCamel(d)));

                this.paginationPage = new PaginationPage().assign(o);

                this.isLoading = false;
            })
    }

    // обработчик формы для поиска по фильтру
    onSubmitSearchBy(form: FormGroup) {
        let data = form.value;

        for (const [key, value] of Object.entries(data))
            data[key] = value !== 'null' ? value : null;


        data.dateCleaning = data.dateCleaning !== null
            ? new Date(data.dateCleaning)
            : null;

        Object.assign(this.filterCleaning, data);

        this.getData(1);
    }

    // сброс данных формы поиска
    resetFormSearchBy(): void {
        this.formSearchBy.reset();
        this.filterCleaning = new CleaningHistoryFilter();
        this.getData();
    }
}
