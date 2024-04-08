import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {Modal} from "flowbite";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Person} from "../../../../models/entities/Person";
import {Utils} from "../../../../utilities/Utils";
import {Employee} from "../../../../models/entities/Employee";
import {ScheduleCleaning} from "../../../../models/entities/ScheduleCleaning";
import {DataService} from "../../../services/data.service";
import {Floor} from "../../../../models/entities/Floor";
import {WeekDay} from "../../../../models/entities/WeekDay";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnChanges, OnInit {

    // тип формы
    public isCreateMode: boolean = true;

    // событие submit
    @Output() onSubmitEvent: EventEmitter<Employee> = new EventEmitter<Employee>();

    // событие увольнения
    @Output() onRemoveEvent: EventEmitter<Employee> = new EventEmitter<Employee>();

    // модальное окно
    public modal: Modal | null = null;

    // запись
    private _sourceItem: Employee = new Employee();

    // график работы
    public schedule: ScheduleCleaning[] = [];

    // этажи
    @Input() public floors: Floor[] = [];

    // дни недели
    @Input() public days: WeekDay[] = [];

    // служащие
    employees: Employee[] = [];

    // новый график
    public newSchedule: ScheduleCleaning[] =
        this.days.map(d => new ScheduleCleaning(
            0, d.id, d, 0, null!, 0, null!
        ));

    get sourceItem(): Employee {
        return this._sourceItem;
    }

    set sourceItem(value: Employee) {
        this._sourceItem = value;

        this.form.patchValue({
            ...this._sourceItem,
            surname: this._sourceItem.person.surname,
            name: this._sourceItem.person.name,
            patronymic: this._sourceItem.person.patronymic,
        });


        // загрузка данных о графике работника
        this._data
            .scheduleEmployee(value.id)
            .subscribe(d => {
                this.schedule = d;

                this.newSchedule = [];

                this.days.forEach(d => {
                    let newItem;

                    let result;
                    if ((result = this.schedule.find(s => s.weekDayId == d.id)) === undefined) {
                        newItem = new ScheduleCleaning();

                        newItem.weekDayId = d.id;
                        newItem.floorId = 0;
                        newItem.weekDay = d;
                    } else
                        newItem = result;

                    this.newSchedule.push(newItem);
                });

                // if (this.newSchedule.length !== 0) {
                this.scheduleForm.controls
                    .forEach((c, i) =>
                        c.setValue({floorId: this.newSchedule[i].floorId}));
                // }
            });
    }

    // форма
    form: FormGroup = this._fb.group({
        id: [0],
        surname: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
        name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
        patronymic: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],

        scheduleForm: this._fb.array(Array(7)
            .fill(0)
            .map(_ => this._fb.group({floorId: 0})))
    });

    // график формы
    get scheduleForm(): FormArray {
        return this.form.controls['scheduleForm'] as FormArray;
    }

    // получить элементы графика в виде объектов для отправки на сервер
    get scheduleObjects(): { employeeId: number, days: number[], floors: number[] } {
        let data = {employeeId: this.sourceItem.id, days: Array<number>(), floors: Array<number>()};
        this.scheduleForm.controls
            .forEach((s, i) => {
                let val = +s.value["floorId"]
                if (val !== 0) {
                    data.floors.push(val);
                    data.days.push(this.days[i].id);
                }
            });

        return data;
    }

    // модальное окно
    @ViewChild('formEmployee') formModal: ElementRef = new ElementRef('');

    // утилиты
    Utils = Utils;


    // конструктор
    constructor(private _fb: FormBuilder, private _data: DataService) {
    }


    // событие инициализации компонента
    ngOnInit() {
    }

    // событие изменения параметров
    ngOnChanges(changes: SimpleChanges) {
        if (changes['sourceItem'] !== undefined) {
            this.form.patchValue({
                ...this._sourceItem,
                surname: this._sourceItem.person.surname,
                name: this._sourceItem.person.name,
                patronymic: this._sourceItem.person.patronymic
            });
        }
    }

    // сброс данных формы
    resetForm(): void {
        this.sourceItem = new Employee();
        this.form.reset();
    }

    // обработчик формы
    onSubmit(form: FormGroup) {
        let value = form.value;
        this.sourceItem = new Employee(value.id,
            this.sourceItem.personId,
            new Person(this.sourceItem.personId, value.surname, value.name, value.patronymic)
        );

        this.onSubmitEvent.emit(this.sourceItem);
        this.hide();
    }

    // обработчик увольнения
    onRemove() {
        this.onRemoveEvent.emit(this._sourceItem);
        this.hide();
    }

    // скрытие формы
    hide() {
        this.modal?.hide();
        this.resetForm();
    }
}
