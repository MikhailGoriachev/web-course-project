import {WeekDay} from "./WeekDay";
import {Employee} from "./Employee";
import {Floor} from "./Floor";
import {Utils} from "../../utilities/Utils";


// Класс График уборки
export class ScheduleCleaning {
    constructor(
        public id: number = 0,
        public weekDayId: number = 0,
        public weekDay: WeekDay = new WeekDay(),
        public employeeId: number = 0,
        public employee: Employee = new Employee(),
        public floorId: number = 0,
        public floor: Floor = new Floor()) {
    }

    static fromJson(json: any): ScheduleCleaning {
        json = Utils.convertSnakeToCamel(json);

        const scheduleCleaning = new ScheduleCleaning();
        scheduleCleaning.assign(json);
        return scheduleCleaning;
    }

    assign(source: Partial<ScheduleCleaning>): ScheduleCleaning {
        return Object.assign(this, source, {
            weekDay: WeekDay.fromJson(source.weekDay),
            employee: Employee.fromJson(source.employee),
            floor: Floor.fromJson(source.floor),
        });
    }

    static assign(source: any): ScheduleCleaning {
        return new ScheduleCleaning().assign(source);
    }

    public formData(): FormData {
        const formData = new FormData();
        formData.append("id", this.id.toString());
        formData.append("week_day_id", this.weekDayId.toString());
        formData.append("employee_id", this.employeeId.toString());
        formData.append("floor_id", this.floorId.toString());

        return formData;
    }
}
