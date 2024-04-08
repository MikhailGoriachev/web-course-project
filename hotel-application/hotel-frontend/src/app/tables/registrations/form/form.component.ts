import {Component, ElementRef, EventEmitter, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Client} from "../../../../models/entities/Client";
import {HotelRoom} from "../../../../models/entities/HotelRoom";
import {City} from "../../../../models/entities/City";
import {Modal} from "flowbite";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegistrationHotelHistory} from "../../../../models/entities/RegistrationHotelHistory";
import {DataService} from "../../../services/data.service";
import {Utils} from "../../../../utilities/Utils";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
    // тип формы
    public isCreateMode: boolean = true;

    // событие submit
    @Output() onSubmitEvent: EventEmitter<RegistrationHotelHistory> = new EventEmitter<RegistrationHotelHistory>();

    // модальное окно
    public modal: Modal | null = null;

    // запись
    private _sourceItem: RegistrationHotelHistory = new RegistrationHotelHistory();

    get sourceItem(): RegistrationHotelHistory {
        return this._sourceItem;
    }

    set sourceItem(value: RegistrationHotelHistory) {
        this._sourceItem = value;

        this.form.patchValue({
            ...this._sourceItem,
            id: this._sourceItem.id,
            hotelRoomId: this._sourceItem.hotelRoomId,
            clientId: this._sourceItem.clientId,
            city: this._sourceItem.city.name,
            registrationDate: this._sourceItem.registrationDate.toISOString().slice(0, 10),
            duration: this._sourceItem.duration,
        });

        this.onChangeRegistrationDate();
    }

    // форма
    form: FormGroup = this._fb.group({
        id: [0],
        clientId: [null, [Validators.required, Validators.min(1)]],
        hotelRoomId: [null, [Validators.required, Validators.min(1)]],
        // cityId: [null, [Validators.required, Validators.min(1)]],
        city: [null, [Validators.required, Validators.min(1)]],
        registrationDate: [null, [Validators.required]],
        duration: [null, [Validators.required, Validators.min(1)]],
    });

    // модальное окно
    @ViewChild('formRegistration') formModal: ElementRef = new ElementRef('');

    // список клиентов
    clientList: Client[] = [];

    // список номеров
    roomList: HotelRoom[] = [];

    // список городов
    cityList: City[] = [];

    // утилиты
    Utils = Utils;


    // конструктор
    constructor(public data: DataService, private _fb: FormBuilder) {
    }


    // событие создания формы
    ngOnInit(): void {
        this.data.clientsGetAll().subscribe(d => this.clientList = d);
        this.data.roomsGetAll().subscribe(d => this.roomList = d);
        this.data.citiesGetAll().subscribe(d => this.cityList = d);
    }


    // событие изменения параметров
    ngOnChanges(changes: SimpleChanges) {
        if (changes['sourceItem'] !== undefined) {
            this.form.patchValue({
                ...this._sourceItem,
                id: this._sourceItem.id,
                hotelRoomId: this._sourceItem.hotelRoomId,
                clientId: this._sourceItem.clientId,
                city: this._sourceItem.city.name,
                registrationDate: this._sourceItem.registrationDate,
                duration: this._sourceItem.duration,
            });
        }
    }

    // сброс данных формы
    resetForm(): void {
        this.form.reset();
    }

    // обработчик формы
    onSubmit(form: FormGroup) {
        let value = form.value;

        if (this.cityList.find(c => c.name === value.city) === undefined) {
            value.city = new City(0, value.city);
            this._sourceItem.cityId = 0;
        }

        this.sourceItem.assign({...value, registrationDate: new Date(value.registrationDate)});

        this.onSubmitEvent.emit(this.sourceItem);
        this.hide();
    }

    // обработчик изменения даты регистрации
    onChangeRegistrationDate() {

        // начальная дата в форме
        let startDate = new Date(this.form.controls['registrationDate'].value);

        // длительность в форме
        let duration = +this.form.controls['duration'].value;
        duration = isNaN(duration) ? 0 : duration;

        // конечная дата в форме
        let endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration);

        // начальная дата в исходной модели
        let sourceDateStart = new Date(this._sourceItem.registrationDate);

        // конечная дата в исходной модели
        let sourceDateEnd = new Date(sourceDateStart);
        sourceDateEnd.setDate(sourceDateStart.getDate() + this._sourceItem.duration);

        this.data
            .roomsEmpty(startDate, duration)
            .subscribe(d => {

                this.roomList = d;

                // если текущая дата и длительность входит в диапазон занятости номера текущей записи
                if (!this.isCreateMode && endDate >= sourceDateStart && startDate <= sourceDateEnd)
                    this.roomList.unshift(this._sourceItem.hotelRoom);

                let selectRoom = this.form.controls['hotelRoomId'].value;
                selectRoom = selectRoom !== null ? +selectRoom : 0;

                // если выбранные данные номера больше не входят в список
                if (this.roomList.find(r => r.id === selectRoom) === undefined) {
                    this.form.controls['hotelRoomId'].setValue(null);
                }
            })
    }

    // скрытие формы
    hide() {
        this.modal?.hide();
    }
}
