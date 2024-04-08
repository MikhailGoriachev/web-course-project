// Класс Тип гостиничной комнаты (номера)
import {Utils} from "../../utilities/Utils";
import {data} from "autoprefixer";

export class HotelRoomType {
    constructor(
        public id: number = 0,
        public name: string = '',
        public countPlace: number = 0,
        public price: number = 0) {
    }

    static fromJson(json: any): HotelRoomType {
        json = Utils.convertSnakeToCamel(json);

        return Object.assign(new HotelRoomType(), json);
    }

    static assign(source: Partial<HotelRoomType>): HotelRoomType {
        return Object.assign(new HotelRoomType(), source);
    }

    assign(source: Partial<HotelRoomType>): HotelRoomType {
        return Object.assign(this, source);
    }

    formData(): FormData {
        const formData = new FormData();

        formData.append("id", this.id.toString());
        formData.append("name", this.name);
        formData.append("count_place", this.countPlace.toString());
        formData.append("price", this.price.toString());

        return formData;
    }
}
