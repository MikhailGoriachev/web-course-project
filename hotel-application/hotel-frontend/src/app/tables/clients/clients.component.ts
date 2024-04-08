import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Client} from "../../../models/entities/Client";
import {FormComponent} from "./form/form.component";
import {Modal} from "flowbite";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaginationPage} from "../../../models/PaginationPage";
import {DataService} from "../../services/data.service";
import {Utils} from 'src/utilities/Utils'

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {

    // данные
    public clients: Client[] = [];

    // индикатор загрузки таблицы
    public isLoading: boolean = false;

    // объект выборки
    public filterClient = new Client();

    // форма
    @ViewChild(FormComponent) form: FormComponent = null!;

    // ссылка на модальное окно
    @ViewChild('modal') formModalRef: ElementRef = new ElementRef('');

    // модальное окно
    public formModal: Modal = new Modal();

    // подписка на событие submit формы
    private subscribeSubmitForm: Subscription = new Subscription();

    // утилиты
    Utils = Utils;

    // форма для фильтра
    formSearchBy: FormGroup = this._fb.group({
        surname: [null, [Validators.minLength(1), Validators.maxLength(60)]],
        name: [null, [Validators.minLength(1), Validators.maxLength(40)]],
        patronymic: [null, [Validators.minLength(1), Validators.maxLength(60)]],
        passport: [null, [Validators.pattern(/^[0-9]{0,9}$/)]],
    });

    // информация о текущей странице
    public paginationPage: PaginationPage = new PaginationPage();

    // получить массив паспортов
    get passportList() {
        return this.clients.map(c => c.passport);
    }


    // конструктор
    constructor(private _data: DataService, private _fb: FormBuilder) {
        this.clients = [];
    }

    // событие инициализация компонента
    ngOnInit(): void {
        this.getData();
    }

    // получение данных с сервера
    public getData(page: number = 0) {
        this.isLoading = true;

        let client = this.filterClient;
        let passport = client.passport.length === 0 ? null : client.passport;
        let surname = client.person.surname.length === 0 ? null : client.person.surname;
        let name = client.person.name.length === 0 ? null : client.person.name;
        let patronymic = client.person.patronymic.length === 0 ? null : client.person.patronymic;

        this._data.clientsIndex(page, passport, surname, name, patronymic)
            .subscribe(o => {
                this.clients = o.data.map((d: any) => Client.fromJson(Utils.convertSnakeToCamel(d)));

                this.paginationPage = new PaginationPage().assign(o);

                this.isLoading = false;
            })
    }

    // обработчик submit формы
    public createSubmit() {
        let item = this.form.sourceItem;

        if (this.form.isCreateMode)
            this._data.peopleStore(item.person)
                .subscribe(id => {
                    item.personId = +id;
                    this._data.clientsStore(item)
                        .subscribe(_ => this.getData(this.paginationPage.currentPage));
                });
        else
            this._data.peopleUpdate(item.person)
                .subscribe(_ => this._data.clientsUpdate(item)
                    .subscribe(_ => this.getData(this.paginationPage.currentPage)));

        this.subscribeSubmitForm.unsubscribe();
    }

    // отобразить модальное окно
    formModalShow(item: Client | null = null) {
        if (this.formModal._targetEl == null)
            this.formModal = new Modal(this.formModalRef.nativeElement);

        this.subscribeSubmitForm = this.form.onSubmitEvent.subscribe(_ => this.createSubmit());
        this.form.resetForm();
        this.form.modal = this.formModal;
        this.form.isCreateMode = item == null;
        this.form.sourceItem = this.form.isCreateMode ? new Client() : Object.assign(new Client, item!);

        this.formModal.show();
    }

    // скрыть модальное окно
    formModalHide() {
        this.subscribeSubmitForm.unsubscribe();
        this.formModal.hide();
    }

    // обработчик формы для поиска по фильтру
    onSubmitSearchBy(form: FormGroup) {
        let value = form.value;

        this.filterClient.person.surname = value.surname ?? '';
        this.filterClient.person.name = value.name ?? '';
        this.filterClient.person.patronymic = value.patronymic ?? '';
        this.filterClient.passport = value.passport ?? '';

        this.getData(0);
    }

    // сброс данных формы поиска
    resetFormSearchBy(): void {
        this.formSearchBy.reset();
        this.filterClient = new Client();
        this.getData();
    }
}
