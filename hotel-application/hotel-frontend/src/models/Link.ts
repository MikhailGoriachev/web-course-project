// Класс Ссылка
export class Link {
    constructor(public url: string = '',
                public label: string = '',
                public active: boolean = false) {
    }

    get value(): number {
        let val = (/[0-9]+$/).exec(this.url);
        return val !== null ? +val[0] : -1;
    }
}
