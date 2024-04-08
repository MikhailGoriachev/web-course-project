import {HotelRoomType} from "./HotelRoomType";
import {Floor} from "./Floor";
import {Person} from "./Person";
import {Utils} from "../../utilities/Utils";


// Класс Гостиничная комната (номер)
export class HotelRoom {
    constructor(
        public id: number = 0,
        public hotelRoomTypeId: number = 0,
        public hotelRoomType: HotelRoomType = new HotelRoomType(),
        public floorId: number = 0,
        public floor: Floor = new Floor(),
        public number: number = 0,
        public phoneNumber: string = '') {
    }

    // получить данные формы
    public formData(): FormData {
        let data = new FormData();

        data.append('id', this.id.toString());
        data.append('hotel_room_type_id', this.hotelRoomTypeId.toString());
        data.append('floor_id', this.floorId.toString());
        data.append('number', this.number.toString());
        data.append('phone_number', this.phoneNumber);

        return data;
    }

    static fromJson(json: any): HotelRoom {
        json = Utils.convertSnakeToCamel(json);

        const hotelRoom = new HotelRoom();
        hotelRoom.assign(json);
        return hotelRoom;
    }

    static assign(source: Partial<HotelRoom>): HotelRoom {
        const hotelRoom = new HotelRoom();
        if (source.id !== undefined) {
            hotelRoom.id = source.id;
        }
        if (source.hotelRoomTypeId !== undefined) {
            hotelRoom.hotelRoomTypeId = source.hotelRoomTypeId;
        }
        if (source.hotelRoomType !== undefined) {
            hotelRoom.hotelRoomType = HotelRoomType.assign(source.hotelRoomType);
        }
        if (source.floorId !== undefined) {
            hotelRoom.floorId = source.floorId;
        }
        if (source.floor !== undefined) {
            hotelRoom.floor = new Floor().assign(source.floor);
        }
        if (source.number !== undefined) {
            hotelRoom.number = source.number;
        }
        if (source.phoneNumber !== undefined) {
            hotelRoom.phoneNumber = source.phoneNumber;
        }
        return hotelRoom;
    }

    assign(source: Partial<HotelRoom>): HotelRoom {
        Object.assign(this, source);

        if (source.hotelRoomType) {
            this.hotelRoomType = HotelRoomType.assign(source.hotelRoomType);
        }
        if (source.floor) {
            this.floor = Floor.assign(source.floor);
        }

        return this;
    }
}
