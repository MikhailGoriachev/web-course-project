import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {City} from "../../models/entities/City";
import {map, Observable} from "rxjs";
import {Client} from "../../models/entities/Client";
import {Person} from "../../models/entities/Person";
import {HotelRoom} from "../../models/entities/HotelRoom";
import {HotelRoomFilter} from "../../models/filters/HotelRoomFilter";
import {HotelRoomType} from "../../models/entities/HotelRoomType";
import {Floor} from "../../models/entities/Floor";
import {RegistrationHotelHistory} from "../../models/entities/RegistrationHotelHistory";
import {RegistrationHotelHistoryFilter} from "../../models/filters/RegistrationHotelHistoryFilter";
import {Utils} from "../../utilities/Utils";
import {Employee} from "../../models/entities/Employee";
import {ScheduleCleaning} from "../../models/entities/ScheduleCleaning";
import {WeekDay} from "../../models/entities/WeekDay";
import {CleaningHistoryFilter} from "../../models/filters/CleaningHistoryFilter";
import {saveAs} from "file-saver";

// Сервис для доступа к данным
@Injectable({
    providedIn: 'root'
})
export class DataService {

    public url: string = 'http://localhost:8989/api'

    constructor(private _http: HttpClient) {
    }

    // #region Города

    // все записи
    public citiesIndex(): Observable<object> {
        return this._http.get(this.url + '/cities/index');
    }

    // все записи без пагинации
    public citiesGetAll(): Observable<City[]> {	
        return this._http
            .get(`${this.url}/cities/get-all`)
            .pipe(map((data: any) => data.map((d: any) => City.fromJson(d))));
    }


    // запись по id
    public citiesShow(id: number): Observable<object> {
        return this._http.get(this.url + `/cities/show/${id}`);
    }

    // добавление записи
    public citiesStore(city: City): Observable<object> {
        return this._http.post(this.url + `/cities/store`, city.formData());
    }

    // изменение записи
    public citiesUpdate(city: City): Observable<object> {
        return this._http.put(this.url + `/cities/update/${city.id}`, city.formData());
    }

    // удаление записи
    public citiesDelete(id: number): Observable<object> {
        return this._http.delete(this.url + `/cities/delete/${id}`);
    }

    // #endregion

    // #region Персоны

    // все записи
    public peopleIndex(page: number = 1): Observable<any> {
        return this._http.get(`${this.url}/people/index?page=${page}`);
    }

    // запись по id
    public peopleShow(id: number): Observable<object> {
        return this._http.get(this.url + `/people/show/${id}`);
    }

    // добавление записи
    public peopleStore(item: Person): Observable<object> {
        return this._http.post(this.url + `/people/store`, item.formData());
    }

    // изменение записи
    public peopleUpdate(item: Person): Observable<object> {
        let data = item.formData();
        data.append('_method', 'put');
        return this._http.post(this.url + `/people/update/${item.id}`, data);
    }

    // #endregion

    // #region Клиенты

    // все записи
    public clientsIndex(page: number = 1,
                        passport: string | null = null,
                        surname: string | null = null,
                        name: string | null = null,
                        patronymic: string | null = null): Observable<any> {

        let params = new HttpParams();

        if (passport !== null)
            params = params.set('passport', passport);

        if (surname !== null)
            params = params.set('surname', surname);

        if (name !== null)
            params = params.set('name', name);

        if (patronymic !== null)
            params = params.set('patronymic', patronymic);

        return this._http.get(`${this.url}/clients/index?page=${page}`, {params});
    }

    // все записи без пагинации
    public clientsGetAll(): Observable<Client[]> {
        return this._http.get(`${this.url}/clients/get-all`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => Client.fromJson(d)))
            );
    }

    // запись по id
    public clientsShow(id: number): Observable<object> {
        return this._http.get(this.url + `/clients/show/${id}`);
    }

    // добавление записи
    public clientsStore(item: Client): Observable<object> {
        return this._http.post(this.url + `/clients/store`, item.formData());
    }

    // изменение записи
    public clientsUpdate(item: Client): Observable<object> {
        let data = item.formData();
        data.append('_method', 'put');
        return this._http.post(this.url + `/clients/update/${item.id}`, data);
    }

    // #endregion

    // #region Номера

    // все записи
    public roomsIndex(page: number = 1, roomFilter: HotelRoomFilter | null = null): Observable<any> {

        let params = new HttpParams();

        if (roomFilter?.hotelRoomTypeId !== null)
            params = params.set('room_type_id', roomFilter!.hotelRoomTypeId);

        if (roomFilter?.floorId !== null)
            params = params.set('floor_id', roomFilter!.floorId);

        if (roomFilter?.number !== null)
            params = params.set('number', roomFilter!.number);

        if (roomFilter?.phoneNumber !== null)
            params = params.set('phone_number', roomFilter!.phoneNumber);

        if (roomFilter?.isBusy !== null)
            params = params.set('is_busy', roomFilter!.isBusy);

        return this._http.get(`${this.url}/rooms/index?page=${page}`, {params});
    }

    // все записи без пагинации
    public roomsGetAll(): Observable<HotelRoom[]> {
        return this._http.get(`${this.url}/rooms/get-all`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => HotelRoom.fromJson(d))));
    }


    // получить занятые номера
    public roomsBusy(): Observable<HotelRoom[]> {
        return this._http.get(`${this.url}/rooms/busy`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => HotelRoom.fromJson(d))));
    }

    // получить свободные номера
    public roomsEmpty(startDate: Date | null = null, duration: number | null = null): Observable<HotelRoom[]> {
        let params = new HttpParams();

        if (startDate !== null)
            params = params.append('startDate', startDate.toISOString());

        if (duration !== null)
            params = params.append('duration', duration.toString());

        return this._http.get(`${this.url}/rooms/empty`, {params})
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => HotelRoom.fromJson(d))));
    }

    // запись по id
    public roomsShow(id: number): Observable<object> {
        return this._http.get(this.url + `/rooms/show/${id}`);
    }

    // #endregion

    // #region Типы номеров

    // все записи без пагинации
    public roomTypesGetAll(): Observable<HotelRoomType[]> {
        return this._http
            .get(`${this.url}/room-types/get-all`)
            .pipe(map((data: any) => data.map((d: any) => HotelRoomType.fromJson(d))));
    }

    // #endregion

    // #region Этажи

    // все записи без пагинации
    public floorsGetAll(): Observable<Floor[]> {
        return this._http
            .get(`${this.url}/floors/get-all`)
            .pipe(map((data: any) => data.map((d: any) => Floor.fromJson(d))));
    }

    // #endregion

    // #region Дни недели

    // все записи без пагинации
    public weekDaysGetAll(): Observable<WeekDay[]> {
        return this._http
            .get(`${this.url}/week-days/get-all`)
            .pipe(map((data: any) => data.map((d: any) => WeekDay.fromJson(d))));
    }

    // #endregion

    // #region Регистрации

    // все записи
    public registrationsIndex(page: number = 1, filter: RegistrationHotelHistoryFilter | null = null): Observable<any> {

        let params = new HttpParams();

        if (filter !== null) {

            if (filter?.clientId !== null)
                params = params.set('client_id', filter!.clientId);

            if (filter?.hotelRoomId !== null)
                params = params.set('hotel_room_id', filter!.hotelRoomId);

            if (filter?.cityId !== null)
                params = params.set('city_id', filter!.cityId);

            if (filter?.registrationDate !== null)
                params = params.set('registration_date', filter!.registrationDate?.toISOString());

            if (filter?.duration !== null)
                params = params.set('duration', filter!.duration);
        }

        return this._http.get(this.url + `/registration-histories/index?page=${page}`, {params})
            .pipe(map(data => Utils.convertSnakeToCamel(data)));
    }

    // запись по id
    public registrationsShow(id: number): Observable<object> {
        return this._http.get(this.url + `/registration-histories/show/${id}`);
    }

    // добавление записи
    public registrationsStore(item: RegistrationHotelHistory): Observable<object> {
        return this._http.post(this.url + `/registration-histories/store`, item.formData());
    }

    // изменение записи
    public registrationsUpdate(item: RegistrationHotelHistory): Observable<object> {
        let data = item.formData();
        data.append('_method', 'put');
        return this._http.post(this.url + `/registration-histories/update/${item.id}`, data);
    }

    // удаление записи
    public registrationsDelete(id: number): Observable<object> {
        return this._http.delete(this.url + `/registration-histories/delete/${id}`);
    }

    // #endregion

    // выселить клиента
    public evictClient(clientId: number, roomId: number): Observable<any> {
        let formData = new FormData();
        formData.append('client_id', clientId.toString());
        formData.append('hotel_room_id', roomId.toString());

        return this._http
            .post(`${this.url}/admin-panel/evict-client`, formData);
    }

    // поселить клиента

    // получить регистрации по гостиничному номеру
    public infoClientsByRoom(roomId: number): Observable<RegistrationHotelHistory[]> {
        let formData = new FormData();
        formData.append('room_id', roomId.toString());

        return this._http
            .post(`${this.url}/queries/info-clients-by-room`, formData)
            .pipe(map((data: any) => data.map((d: any) => RegistrationHotelHistory.fromJson(d))));
    }

    // #region Служащие

    // все записи
    public employeesIndex(page: number = 1,
                          surname: string | null = null,
                          name: string | null = null,
                          patronymic: string | null = null): Observable<any> {

        let params = new HttpParams();

        if (surname !== null)
            params = params.set('surname', surname);

        if (name !== null)
            params = params.set('name', name);

        if (patronymic !== null)
            params = params.set('patronymic', patronymic);

        return this._http.get(`${this.url}/employees/index?page=${page}`, {params});
    }

    // все записи без пагинации
    public employeesGetAll(): Observable<Employee[]> {
        return this._http.get(`${this.url}/employees/get-all`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => Employee.fromJson(d)))
            );
    }

    // все записи включая удалённые без пагинации
    public employeesGetWithTrashedAll(): Observable<Employee[]> {
        return this._http.get(`${this.url}/employees/get-with-trashed-all`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => Employee.fromJson(d)))
            );
    }

    // запись по id
    public employeesShow(id: number): Observable<object> {
        return this._http.get(this.url + `/employees/show/${id}`);
    }

    // добавление работника
    public employeesStore(item: Employee): Observable<object> {
        return this._http.post(this.url + `/admin-panel/add-employee`, item.formData());
    }

    // изменение записи
    public employeesUpdate(item: Employee): Observable<object> {
        let data = item.formData();
        data.append('_method', 'put');
        return this._http.post(this.url + `/employees/update/${item.id}`, data);
    }

    // удаление работника
    public employeesDelete(id: number): Observable<object> {
        return this._http.get(this.url + `/admin-panel/remove-employee/${id}`);
    }

    // #endregion

    // #region График работы

    // все записи
    public scheduleIndex(page: number = 1,
                         surname: string | null = null,
                         name: string | null = null,
                         patronymic: string | null = null): Observable<any> {

        let params = new HttpParams();

        if (surname !== null)
            params = params.set('surname', surname);

        if (name !== null)
            params = params.set('name', name);

        if (patronymic !== null)
            params = params.set('patronymic', patronymic);

        return this._http.get(`${this.url}/schedule/index?page=${page}`, {params});
    }

    // все записи без пагинации
    public scheduleGetAll(): Observable<Employee[]> {
        return this._http.get(`${this.url}/schedule/get-all`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => Employee.fromJson(d)))
            );
    }

    // запись по id
    public scheduleShow(id: number): Observable<object> {
        return this._http.get(this.url + `/schedule/show/${id}`);
    }

    // добавление работника
    public scheduleStore(item: Employee): Observable<object> {
        return this._http.post(this.url + `/admin-panel/add-employee`, item.formData());
    }

    // изменение записи
    public scheduleUpdate(item: Employee): Observable<object> {
        let data = item.formData();
        data.append('_method', 'put');
        return this._http.post(this.url + `/schedule/update/${item.id}`, data);
    }

    // удаление работника
    public scheduleDelete(id: number): Observable<object> {
        return this._http.get(this.url + `/admin-panel/remove-employee/${id}`);
    }

    // получить график работника
    // Route::get('/admin-panel/employee-schedule/{id}', [AdminPanelController::class, 'getEmployeeSchedule']);

    // получить график работника
    public scheduleEmployee(employeeId: number): Observable<ScheduleCleaning[]> {
        return this._http.get(`${this.url}/admin-panel/employee-schedule/${employeeId}`)
            .pipe(map(data => Utils.convertSnakeToCamel(data)
                .map((d: any) => ScheduleCleaning.fromJson(d)))
            );
    }

    // изменить расписание работника
    // Route::post('/admin-panel/change-schedule-employee', [AdminPanelController::class, 'changeScheduleEmployee']);

    // изменить расписание работника
    public scheduleEmployeeChange(newSchedule: {
        employeeId: number,
        days: number[],
        floors: number[]
    }): Observable<any> {

        let data = new FormData();

        data.append('employee_id', newSchedule.employeeId.toString());

        newSchedule.days.forEach((d, i) => {
            data.append('days[]', d.toString());
            data.append('floors[]', newSchedule.floors[i].toString());
        })

        return this._http.post(`${this.url}/admin-panel/change-schedule-employee`, data);
    }

    // #endregion

    // #region История уборок

    // все записи
    public cleaningHistoriesIndex(page: number = 1, filter: CleaningHistoryFilter | null = null): Observable<any> {

        let params = new HttpParams();

        if (filter !== null) {

            if (filter?.dateCleaning !== null)
                params = params.set('date_cleaning', filter!.dateCleaning.toISOString());

            if (filter?.floorId !== null)
                params = params.set('floor_id', filter!.floorId);

            if (filter?.employeeId !== null)
                params = params.set('employee_id', filter!.employeeId);

            if (filter?.roomId !== null)
                params = params.set('room_id', filter!.roomId);
        }

        return this._http.get(`${this.url}/cleaning-histories/index?page=${page}`, {params});
    }

    // запись по id
    public cleaningHistoriesShow(id: number): Observable<object> {
        return this._http.get(this.url + `/cleaning-histories/show/${id}`);
    }

    // #endregion

    // квартальный отчёт
    public getReportByDateRange(beginDate: string, endDate: string, collback: () => void = () => {
    }) {

        let data = new FormData();

        data.append('begin_date', beginDate);
        data.append('end_date', endDate);

        return this._http.post(`${this.url}/reports/get-report-by-date-range`, data, {
            responseType: "blob",
        }).subscribe(
            data => {
                saveAs(data, `report_${beginDate}_${endDate}.pdf`);
                collback();
            }
        );
    }

}
