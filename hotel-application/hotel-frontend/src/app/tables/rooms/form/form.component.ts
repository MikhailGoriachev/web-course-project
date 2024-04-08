import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Modal} from "flowbite";
import {FormBuilder} from "@angular/forms";
import {Utils} from "../../../../utilities/Utils";
import {DataService} from "../../../services/data.service";
import {RegistrationHotelHistory} from "../../../../models/entities/RegistrationHotelHistory";
import {HotelRoom} from "../../../../models/entities/HotelRoom";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

    // модальное окно
    public modal: Modal | null = null;

    // запись
    private _sourceItem: HotelRoom = new HotelRoom();

    // событие выселения клиента
    @Output() onEvictEvent: EventEmitter<RegistrationHotelHistory> = new EventEmitter<RegistrationHotelHistory>();

    get sourceItem(): HotelRoom {
        return this._sourceItem;
    }

    set sourceItem(value: HotelRoom) {
        this._sourceItem = value;

        // загрузка информации о клиентах
        this.getDataInfo();
    }

    // коллекция текущих регистраций для номера
    public registrations: RegistrationHotelHistory[] = []

    // модальное окно
    @ViewChild('formRoom') formModal: ElementRef = new ElementRef('');

    // утилиты
    Utils = Utils;


    // конструктор
    constructor(private _fb: FormBuilder, private _data: DataService) {
    }


    // событие инициализации компонента
    ngOnInit() {
    }

    // скрытие окна
    hide() {
        this.modal?.hide();
    }

    // получение данных о номере
    getDataInfo() {
        this._data
            .infoClientsByRoom(this._sourceItem.id)
            .subscribe(d => this.registrations = d);
    }
}
