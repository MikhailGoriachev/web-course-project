import {Floor} from "./Floor";
import {Employee} from "./Employee";
import {Utils} from "../../utilities/Utils";


// Класс История уборки
export class CleaningHistory {
    constructor(public floorId: number = 0,
                public floor: Floor = new Floor(),
                public dateCleaning: Date = new Date(),
                public employeeId: number = 0,
                public employee: Employee = new Employee()) {
    }

    static fromJson(json: any): CleaningHistory {
        json = Utils.convertSnakeToCamel(json);

        const floor = Floor.fromJson(json.floor);
        const employee = Employee.fromJson(json.employee);
        return new CleaningHistory(
            json.floorId,
            floor,
            new Date(json.dateCleaning),
            json.employeeId,
            employee
        );
    }

    assign(source: Partial<CleaningHistory>): CleaningHistory {
        Object.assign(this, source);
        if (source.floor) {
            this.floor.assign(source.floor);
        }
        if (source.employee) {
            this.employee.assign(source.employee);
        }

        return this;
    }

    static assign(source: Partial<CleaningHistory>): CleaningHistory {
        return new CleaningHistory().assign(source);
    }

    formData(): FormData {
        const data = new FormData();
        data.append('floorId', this.floorId.toString());
        data.append('dateCleaning', this.dateCleaning.toISOString());
        data.append('employeeId', this.employeeId.toString());
        return data;
    }
}
