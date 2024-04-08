import {Person} from "./Person";
import {Utils} from "../../utilities/Utils";


// Класс Работник
export class Employee {
    constructor(public id: number = 0,
                public personId: number = 0,
                public person: Person = new Person()) {
    }

    static fromJson(json: any): Employee {
        json = Utils.convertSnakeToCamel(json);

        const employee = Object.assign(new Employee(), json);
        employee.person = Person.fromJson(json.person);
        return employee;
    }

    static assign(source: Partial<Employee>): Employee {
        let obj = Object.assign(new Employee(), source);
        if (source.person) {
            obj.person.assign(source.person);
        }

        return obj;
    }

    assign(source: Partial<Employee>): Employee {
        Object.assign(this, source);
        if (source.person) {
            this.person.assign(source.person);
        }

        return this;
    }

    public formData(): FormData {
        const data = new FormData();
        data.append('id', this.id.toString());
        data.append('person_id', this.personId.toString());
        return data;
    }
}
