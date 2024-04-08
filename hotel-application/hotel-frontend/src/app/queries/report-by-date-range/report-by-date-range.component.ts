import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-report-by-date-range',
    templateUrl: './report-by-date-range.component.html'
})
export class ReportByDateRangeComponent {

    // индикатор загрузки таблицы
    public isLoading: boolean = false;

    // форма для фильтра
    public form: FormGroup = this._fb.group({
        beginDate: [null, [Validators.required]],
        endDate: [null, [Validators.required]],
    }, {validators: this.dateRangeValidator});


    // конструктор
    constructor(private _fb: FormBuilder, private _data: DataService) {
    }


    // обработка submit формы
    onSubmit(form: FormGroup) {
        let value = form.value;
        this.isLoading = true;
        this._data.getReportByDateRange(value.beginDate, value.endDate, () => this.isLoading = false) ;
    }


    // валидатор для диапазона дат
    dateRangeValidator(group: FormGroup): {[key: string]: any} | null {
        const beginDate = new Date(group.controls['beginDate'].value);
        const endDate = new Date(group.controls['endDate'].value);
        if (beginDate >= endDate) {
            return { 'invalidDateRange': true };
        }
        return null;
    }
}
