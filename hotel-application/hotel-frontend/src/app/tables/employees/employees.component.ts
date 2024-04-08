import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../models/entities/Employee";
import {FormComponent} from "./form/form.component";
import {Modal} from "flowbite";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaginationPage} from "../../../models/PaginationPage";
import {DataService} from "../../services/data.service";
import {Utils} from "../../../utilities/Utils";
import {Floor} from "../../../models/entities/Floor";
import {WeekDay} from "../../../models/entities/WeekDay";

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html'
})
export class EmployeesComponent implements OnInit, OnDestroy {


    // данные
    public employees: Employee[] = [];

    // индикатор загрузки таблицы
    public isLoading: boolean = false;

    // объект выборки
    public filterEmployee = new Employee();

    // форма
    @ViewChild(FormComponent) form: FormComponent = null!;

    // ссылка на модальное окно
    @ViewChild('modal') formModalRef: ElementRef = new ElementRef('');

    // модальное окно
    public formModal: Modal = new Modal();

    // подписка на событие submit формы
    private subscribeSubmitForm: Subscription = new Subscription();

    // этажи
    public floors: Floor[] = [];

    // дни недели
    public days: WeekDay[] = [];

    // утилиты
    Utils = Utils;

    // форма для фильтра
    formSearchBy: FormGroup = this._fb.group({
        surname: [null, [Validators.minLength(1), Validators.maxLength(60)]],
        name: [null, [Validators.minLength(1), Validators.maxLength(40)]],
        patronymic: [null, [Validators.minLength(1), Validators.maxLength(60)]],
    });

    // информация о текущей странице
    public paginationPage: PaginationPage = new PaginationPage();


    // конструктор
    constructor(private _data: DataService, private _fb: FormBuilder) {
        this.employees = [];
    }

    // событие инициализация компонента
    ngOnInit(): void {
        this.getData();

        // получение данных об этажах
        this._data.floorsGetAll().subscribe(d => this.floors = d);

        // получение данных о днях недели
        this._data.weekDaysGetAll().subscribe(d => this.days = d);
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

        let employee = this.filterEmployee;
        let surname = employee.person.surname.length === 0 ? null : employee.person.surname;
        let name = employee.person.name.length === 0 ? null : employee.person.name;
        let patronymic = employee.person.patronymic.length === 0 ? null : employee.person.patronymic;

        this._data.employeesIndex(page, surname, name, patronymic)
            .subscribe(o => {
                this.employees = o.data.map((d: any) => Employee.fromJson(Utils.convertSnakeToCamel(d)));

                this.paginationPage = new PaginationPage().assign(o);

                this.isLoading = false;
            })
    }

    // обработчик submit формы
    public onFormSubmit() {
        let item = this.form.sourceItem;

        let schedule = this.form.scheduleObjects;

        if (this.form.isCreateMode)
            this._data.peopleStore(item.person)
                .subscribe(id => {
                    item.personId = +id;
                    this._data.employeesStore(item)
                        .subscribe(id => {
                                schedule.employeeId = +id;
                                this._data.scheduleEmployeeChange(schedule).subscribe();

                                this.getData(this.paginationPage.currentPage);
                            }
                        );
                });
        else
            this._data.peopleUpdate(item.person)
                .subscribe(_ => this._data.employeesUpdate(item)
                    .subscribe(_ => {
                            this._data.scheduleEmployeeChange(schedule).subscribe();

                            this.getData(this.paginationPage.currentPage);
                        }
                    )
                );
    }

    // отобразить модальное окно
    formModalShow(item: Employee | null = null) {
        if (this.formModal._targetEl == null)
            this.formModal = new Modal(this.formModalRef.nativeElement);

        this.form.resetForm();
        this.form.modal = this.formModal;
        this.form.isCreateMode = item == null;
        this.form.employees = this.employees;
        this.form.sourceItem = this.form.isCreateMode ? new Employee() : Object.assign(new Employee, item!);

        this.formModal.show();
    }

    // уволить служащего
    removeEmployee(item: Employee) {
        this._data.employeesDelete(item.id)
            .subscribe(_ => this.getData(this.paginationPage.currentPage));
    }

    // скрыть модальное окно
    formModalHide() {
        this.formModal.hide();
    }

    // обработчик формы для поиска по фильтру
    onSubmitSearchBy(form: FormGroup) {
        let value = form.value;

        this.filterEmployee.person.surname = value.surname ?? '';
        this.filterEmployee.person.name = value.name ?? '';
        this.filterEmployee.person.patronymic = value.patronymic ?? '';

        this.getData(0);
    }

    // сброс данных формы поиска
    resetFormSearchBy(): void {
        this.formSearchBy.reset();
        this.filterEmployee = new Employee();
        this.getData();
    }
}
