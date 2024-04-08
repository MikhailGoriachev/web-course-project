import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RegistrationHotelHistory} from "../../../models/entities/RegistrationHotelHistory";

import {Modal} from "flowbite";
import {Utils} from "../../../utilities/Utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaginationPage} from "../../../models/PaginationPage";
import {DataService} from "../../services/data.service";
import {RegistrationHotelHistoryFilter} from "../../../models/filters/RegistrationHotelHistoryFilter";
import {FormComponent} from "./form/form.component";
import {Subscription} from "rxjs";
import {Client} from "../../../models/entities/Client";
import {HotelRoom} from "../../../models/entities/HotelRoom";
import {City} from "../../../models/entities/City";

@Component({
    selector: 'app-registrations',
    templateUrl: './registrations.component.html'
})
export class RegistrationsComponent implements OnInit, OnDestroy {

    // данные
    public registrations: RegistrationHotelHistory[] = [];

    // индикатор загрузки таблицы
    public isLoading: boolean = false;

    // объект выборки
    public filterRegistration = new RegistrationHotelHistoryFilter();

    // форма
    @ViewChild(FormComponent) form: FormComponent = null!;

    // ссылка на модальное окно
    @ViewChild('modal', {static: true}) formModalRef: ElementRef = new ElementRef('');

    // модальное окно
    public formModal: Modal = new Modal();

    // подписка на событие submit формы
    private subscribeSubmitForm: Subscription = new Subscription();

    // утилиты
    Utils = Utils;

    // форма для фильтра
    formSearchBy: FormGroup = this._fb.group({
        clientId: [null, [Validators.min(1)]],
        hotelRoomId: [null, [Validators.min(1)]],
        cityId: [null, [Validators.min(1)]],
        registrationDate: [null],
        duration: [null, [Validators.min(1)]],
    });

    // информация о текущей странице
    public paginationPage: PaginationPage = new PaginationPage();

    // список клиентов
    clientList: Client[] = [];

    // список номеров
    roomList: HotelRoom[] = [];

    // список городов
    cityList: City[] = [];


    // конструктор
    constructor(private _data: DataService, private _fb: FormBuilder) {
    }


    // событие инициализация компонента
    ngOnInit(): void {
        this.getData();

        this._data.clientsGetAll().subscribe(d => this.clientList = d);
        this._data.roomsGetAll().subscribe(d => this.roomList = d);
        this._data.citiesGetAll().subscribe(d => this.cityList = d);
    }

    // событие окончания инициализации представления
    ngAfterViewInit() {
        this.subscribeSubmitForm = this.form.onSubmitEvent
            .subscribe(_ => this.onFormSubmit());
    }

    // событие деструктора
    ngOnDestroy(): void {
        this.subscribeSubmitForm.unsubscribe();
    }

    // получение данных с сервера
    public getData(page: number = 0) {
        this.isLoading = true;

        this._data.registrationsIndex(page, this.filterRegistration)
            .subscribe(o => {
                this.registrations = o.data.map((d: any) => RegistrationHotelHistory.fromJson(Utils.convertSnakeToCamel(d)));

                this.paginationPage = new PaginationPage().assign(o);

                this.isLoading = false;
            })
    }

    // обработчик submit формы
    public onFormSubmit() {
        let item = this.form.sourceItem;

        let process = () => {

            if (this.form.isCreateMode)
                this._data.registrationsStore(item)
                    .subscribe(_ => this.getData(this.paginationPage.currentPage));
            else
                this._data.registrationsUpdate(item)
                    .subscribe(_ => this.getData(this.paginationPage.currentPage));
        };

        if (item.cityId === 0)
            this._data.citiesStore(item.city).subscribe(id => {
                item.cityId = +id;
                this._data.citiesGetAll().subscribe(d => this.form.cityList = this.cityList = d);
                process();
            })
        else
            process();
    }

    // отобразить модальное окно
    formModalShow(item: RegistrationHotelHistory | null = null) {
        if (this.formModal._targetEl == null)
            this.formModal = new Modal(this.formModalRef.nativeElement);

        this.form.resetForm();
        this.form.modal = this.formModal;
        this.form.isCreateMode = item == null;
        this.form.sourceItem = this.form.isCreateMode
            ? new RegistrationHotelHistory()
            : Object.assign(new RegistrationHotelHistory(), item!);

        this.formModal.show();
    }

    // скрыть модальное окно
    formModalHide() {
        this.formModal.hide();
    }

    // обработчик формы для поиска по фильтру
    onSubmitSearchBy(form: FormGroup) {

        let data = form.value;

        for (const [key, value] of Object.entries(data))
            data[key] = value !== 'null' ? value : null;

        data.registrationDate = data.registrationDate !== null
            ? new Date(data.registrationDate)
            : null;

        Object.assign(this.filterRegistration, data);

        this.getData(1);
    }

    // сброс данных формы поиска
    resetFormSearchBy(): void {
        this.formSearchBy.reset();
        this.filterRegistration = new RegistrationHotelHistoryFilter();
        this.getData();
    }
}
