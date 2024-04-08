import {Person} from "./Person";
import {Utils} from "../../utilities/Utils";


// Класс Клиент
export class Client {
    constructor(
        public id: number = 0,
        public personId: number = 0,
        public person: Person = new Person(),
        public passport: string = '') {
    }


    // получить данные формы
    public formData(): FormData {
        let data = new FormData();

        data.append('id', this.id.toString());
        data.append('person_id', this.personId.toString());
        data.append('passport', this.passport);

        return data;
    }

    static fromJson(json: any): Client {
        json = Utils.convertSnakeToCamel(json);

        const client = Object.assign(new Client(), json);
        client.person = Object.assign(new Person(), client.person);
        return client;
    }

    static assign(obj: any): Client {
        const client = new Client();
        client.id = obj.id ?? client.id;
        client.personId = obj.personId ?? client.personId;
        client.passport = obj.passport ?? client.passport;
        client.person = obj.person ? Person.assign(obj.person) : client.person;
        return client;
    }

    assign(source: Partial<Client>): Client {
        return Object.assign(this, source);
    }
}
