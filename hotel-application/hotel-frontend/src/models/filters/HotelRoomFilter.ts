// Класс Фильтр для номера
export class HotelRoomFilter {
    constructor(public id: number = 0,
                public hotelRoomTypeId: number | null = null,
                public floorId: number | null = null,
                public number: number | null = null,
                public phoneNumber: string | null = null,
                public isBusy: boolean | null = null) {
    }
}
