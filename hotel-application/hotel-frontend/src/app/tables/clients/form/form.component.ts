import {
    Component,
    ElementRef,
    EventEmitter, Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {Client} from "../../../../models/entities/Client";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Modal} from "flowbite";
import {Utils} from "../../../../utilities/Utils";
import {Person} from "../../../../models/entities/Person";
import {uniquePassportValidator} from "../../../../validators/uniquePassportValidator";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnChanges {

    // тип формы
    public isCreateMode: boolean = true;

    // событие submit
    @Output() onSubmitEvent: EventEmitter<Client> = new EventEmitter<Client>();

    // массив паспортов
    @Input() passportList: string[] = [];

    // модальное окно
    public modal: Modal | null = null;

    // запись
    private _sourceItem: Client = new Client();

    get sourceItem(): Client {
        return this._sourceItem;
    }

    set sourceItem(value: Client) {
        this._sourceItem = value;

        this.form.patchValue({
            ...this._sourceItem,
            surname: this._sourceItem.person.surname,
            name: this._sourceItem.person.name,
            patronymic: this._sourceItem.person.patronymic,
            passport: this._sourceItem.passport
        });
    }

    // форма
    form: FormGroup = this._fb.group({
        id: [0],
        surname: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
        name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
        patronymic: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
        passport: [null, {
            validators: [
                Validators.required,
                Validators.pattern(/^[0-9]{9}$/),
                uniquePassportValidator(() => this.getPassportList())
            ]
        }]
    });

    // модальное окно
    @ViewChild('formClient') formModal: ElementRef = new ElementRef('');

    // утилиты
    Utils = Utils;


    // конструктор
    constructor(private _fb: FormBuilder) {
    }


    // событие изменения параметров
    ngOnChanges(changes: SimpleChanges) {
        if (changes['sourceItem'] !== undefined) {
            this.form.patchValue({
                ...this._sourceItem,
                surname: this._sourceItem.person.surname,
                name: this._sourceItem.person.name,
                patronymic: this._sourceItem.person.patronymic,
                passport: this._sourceItem.passport
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
        this.sourceItem = new Client(value.id,
            this.sourceItem.personId,
            new Person(this.sourceItem.personId, value.surname, value.name, value.patronymic),
            value.passport
        );

        this.onSubmitEvent.emit(this.sourceItem);
        this.hide();
    }

    // получить список паспортов
    getPassportList(): string[] {
        return this.isCreateMode
            ? this.passportList
            : this.passportList.filter(p => p !== this._sourceItem.passport)
    }

    // скрытие формы
    hide() {
        this.modal?.hide();
    }
}
