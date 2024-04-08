// Класс Фильтр для регистрации в гостинице
export class RegistrationHotelHistoryFilter {
    constructor(public clientId: number | null = null,
                public hotelRoomId: number | null = null,
                public cityId: number | null = null,
                public registrationDate: Date | null = null,
                public duration: number | null = null) {
    }
}
