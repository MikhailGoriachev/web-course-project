import {Client} from "./Client";
import {HotelRoom} from "./HotelRoom";
import {City} from "./City";
import {Person} from "./Person";
import {Utils} from "../../utilities/Utils";
import {HotelRoomType} from "./HotelRoomType";


// Класс Регистрация в гостинице
export class RegistrationHotelHistory {
    constructor(public id: number = 0,
                public clientId: number = 0,
                public client: Client = new Client(),
                public hotelRoomId: number = 0,
                public hotelRoom: HotelRoom = new HotelRoom(),
                public cityId: number = 0,
                public city: City = new City(),
                public registrationDate: Date = new Date(),
                public duration: number = 0) {
    }

    static fromJson(json: any): RegistrationHotelHistory {
        json = Utils.convertSnakeToCamel(json);

        const regHotelHist = new RegistrationHotelHistory().assign(json);
        regHotelHist.client = new Client().assign(regHotelHist.client);
        regHotelHist.hotelRoom = new HotelRoom().assign(regHotelHist.hotelRoom);
        regHotelHist.city = new City().assign(regHotelHist.city);
        regHotelHist.registrationDate = new Date(regHotelHist.registrationDate);
        return regHotelHist;
    }

    static assign(target: RegistrationHotelHistory, source: any): RegistrationHotelHistory {
        const updatedTarget = Object.assign(target, source);
        updatedTarget.client = Object.assign(target.client, source.client);
        updatedTarget.hotelRoom = Object.assign(target.hotelRoom, source.hotelRoom);
        updatedTarget.city = Object.assign(target.city, source.city);
        return updatedTarget;
    }

    assign(source: Partial<RegistrationHotelHistory>): RegistrationHotelHistory {
        Object.assign(this, source);

        if (source.client)
            this.client = new Client().assign(source.client);

        if (source.hotelRoom)
            this.hotelRoom = new HotelRoom().assign(source.hotelRoom);

        if (source.city)
            this.city = new City().assign(source.city);

        return this;
    }

    public formData(): FormData {
        const data = new FormData();

        data.append('id', this.id.toString());
        data.append('client_id', this.clientId.toString());
        data.append('hotel_room_id', this.hotelRoomId.toString());
        data.append('city_id', this.cityId.toString());
        data.append('registration_date', this.registrationDate.toISOString());
        data.append('duration', this.duration.toString());

        return data;
    }
}
