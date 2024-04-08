// Класс День недели
import {Utils} from "../../utilities/Utils";

export class WeekDay {
    constructor(
        public id: number = 0,
        public name: string = '',
        public number: number = 0) {
    }

    static fromJson(json: any): WeekDay {
        json = Utils.convertSnakeToCamel(json);

        return new WeekDay(json.id, json.name, json.number);
    }

    static assign(target: WeekDay, source: any): WeekDay {
        return Object.assign(target, source);
    }

    assign(source: any): WeekDay {
        return Object.assign(this, source);
    }

    public formData(): FormData {
        const formData = new FormData();

        formData.append("id", this.id.toString());
        formData.append("name", this.name);
        formData.append("number", this.number.toString());

        return formData;
    }
}
