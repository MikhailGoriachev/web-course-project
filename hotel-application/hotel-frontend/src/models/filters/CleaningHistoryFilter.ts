// Класс История уборки
export class CleaningHistoryFilter {
    constructor(public floorId: number | null = null,
                public dateCleaning: Date | null = null,
                public employeeId: number | null = null,
                public roomId: number | null = null) {
    }
}
