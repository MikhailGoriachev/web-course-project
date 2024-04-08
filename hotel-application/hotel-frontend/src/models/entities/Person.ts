// Класс Персона
import {Utils} from "../../utilities/Utils";

export class Person {
    constructor(
        public id: number = 0,
        public surname: string = '',
        public name: string = '',
        public patronymic: string = '') {
    }


    // получить данные формы
    public formData(): FormData {

        let data = new FormData();

        data.append('id', this.id.toString());
        data.append('surname', this.surname);
        data.append('name', this.name);
        data.append('patronymic', this.patronymic);

        return data;
    }

    static fromJson(json: any): Person {
        json = Utils.convertSnakeToCamel(json);

        return new Person(
            json.id,
            json.surname,
            json.name,
            json.patronymic
        );
    }

    static assign(source: Partial<Person>): Person {
        return Object.assign(new Person(), source);
    }

    assign(source: Partial<Person>): Person {
        return Object.assign(this,  source);
    }
}
