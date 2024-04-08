// Класс Город
import {Utils} from "../../utilities/Utils";

export class City {
    constructor(
        public id: number = 0,
        public name: string = '') {
    }

    static fromJson(json: any): City {
        json = Utils.convertSnakeToCamel(json);

        return new City(json.id, json.name);
    }

    static assign(source: Partial<City>): City {
        return Object.assign(new City(), source);
    }

    assign(source: Partial<City>): City {
        return Object.assign(this, source);
    }

    public formData(): FormData {
        const data = new FormData();
        data.append('id', this.id.toString());
        data.append('name', this.name);
        return data;
    }
}
