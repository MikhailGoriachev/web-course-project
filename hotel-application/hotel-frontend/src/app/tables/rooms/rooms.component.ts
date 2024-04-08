import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HotelRoom} from "../../../models/entities/HotelRoom";
import {PaginationPage} from "../../../models/PaginationPage";
import {DataService} from "../../services/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HotelRoomFilter} from "../../../models/filters/HotelRoomFilter";
import {Utils} from "../../../utilities/Utils";
import {HotelRoomType} from "../../../models/entities/HotelRoomType";
import {Floor} from "../../../models/entities/Floor";
import {Modal} from "flowbite";
import {FormComponent} from "./form/form.component";
import {RegistrationHotelHistory} from "../../../models/entities/RegistrationHotelHistory";

@Component({
    selector: 'app-rooms',
    templateUrl: './rooms.component.html'
})
export class RoomsComponent implements OnInit {

    // данные
    public items: HotelRoom[] = [];

    // индикатор загрузки страницы
    public isLoading: boolean = false;

    // объект выборки
    public filterRoom = new HotelRoomFilter();

    // информация о текущей странице
    public paginationPage: PaginationPage = new PaginationPage();

    // утилиты
    public Utils = Utils;

    // форма для фильтра
    formSearchBy: FormGroup = this._fb.group({
        hotelRoomTypeId: [null, [Validators.min(1)]],
        floorId: [null, [Validators.min(1)]],
        number: [null, [Validators.min(1)]],
        phoneNumber: [null, [Validators.pattern(/^[0-9]{0,5}$/)]],
        isBusy: [null, []],
    });

    // коллекция типов номеров
    public roomTypes: HotelRoomType[] = [];

    // этажи
    public floors: Floor[] = [];

    // ссылка на модальное окно
    @ViewChild('modal') formModalRef: ElementRef = new ElementRef('');

    // модальное окно
    public formModal: Modal = new Modal();

    // форма
    @ViewChild(FormComponent) form: FormComponent = null!;


    // конструктор
    constructor(private _data: DataService, private _fb: FormBuilder) {
        this.items = [];
    }


    // событие инициализации компонента
    ngOnInit(): void {
        this.getData();

        // получение данных о типах номеров
        this._data.roomTypesGetAll().subscribe(d => this.roomTypes = d);

        // получение данных об этажах
        this._data.floorsGetAll().subscribe(d => this.floors = d);
    }

    // получение данных
    public getData(page: number = 0) {
        this.isLoading = true;

        this._data.roomsIndex(page, this.filterRoom)
            .subscribe(o => {
                this.items = o.data.map((d: any) => HotelRoom.fromJson(d));

                this.paginationPage = new PaginationPage().assign(o);

                this.isLoading = false;
            });
    }

    // обработчик формы для поиска по фильтру
    onSubmitSearchBy(form: FormGroup) {
        let value = form.value;

        if (value.hotelRoomTypeId !== null)
            this.filterRoom.hotelRoomTypeId = value.hotelRoomTypeId !== "null" ? value.hotelRoomTypeId : null;

        if (value.floorId !== null)
            this.filterRoom.floorId = value.floorId != "null" ? value.floorId : null;

        if (value.isBusy !== null)
        this.filterRoom.isBusy = value.isBusy != "null" ? value.isBusy === "true" : null;

        this.filterRoom.number = value.number;
        this.filterRoom.phoneNumber = value.phoneNumber;

        this.getData(0);
    }

    // сброс данных формы поиска
    resetFormSearchBy(): void {
        this.formSearchBy.reset();
        this.filterRoom = new HotelRoomFilter();
        this.getData();
    }

    // отобразить модальное окно
    formModalShow(item: HotelRoom) {
        if (this.formModal._targetEl == null)
            this.formModal = new Modal(this.formModalRef.nativeElement);

        this.form.modal = this.formModal;
        this.form.sourceItem = item;

        this.formModal.show();
    }

    // скрыть модальное окно
    formModalHide() {
        this.formModal.hide();
    }

    // выселение клиента
    evictClient(registration: RegistrationHotelHistory) {
        this._data.evictClient(registration.clientId, registration.hotelRoomId)
            .subscribe(_ => {
                this.getData(this.paginationPage.currentPage);
                this.form.getDataInfo();
            });
    }
}
