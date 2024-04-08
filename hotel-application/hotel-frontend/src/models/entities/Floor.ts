import {Utils} from "../../utilities/Utils";

// Класс Этаж
export class Floor {
    constructor(
        public id: number = 0,
        public number: number = 0) {
    }

    static fromJson(json: any): Floor {
        json = Utils.convertSnakeToCamel(json);

        const {id, number} = json;
        return new Floor(id, number);
    }

    static assign(source: Partial<Floor>): Floor {
        return Object.assign(new Floor(), source);
    }

    assign(source: Partial<Floor>): Floor {
        return Object.assign(this, source);
    }

    public formData(): FormData {
        const data = new FormData();
        data.append('id', this.id.toString());
        data.append('number', this.number.toString());
        return data;
    }
}
