// Класс Ссылка
import {Person} from "./entities/Person";
import {Link} from "./Link";

export class PaginationPage {
    constructor(public currentPage: number = 1,
                public links: Link[] = [],
                public total: number = 0,
                public to: number = 0) {
    }

    // предыдущая страница
    public get prevPage(): number | null {
        if (this.links == null || this.links.length == 0 || this.links[0].url == null)
            return null;

        return this.links[0].value;
    }

    // следующая страница
    public get nextPage(): number | null {
        if (this.links == null) return null;

        let index = this.links.length - 1;

        let link;

        if (this.links.length == 0 || (link = this.links[index]) == null || link.url == null)
            return null;

        return link.value;
    }

    assign(obj: Partial<PaginationPage>): PaginationPage {
        const data = Object.assign(new PaginationPage(), obj);
        data.links = data.links.map(l => Object.assign(new Link(), l));

        return data;
    }
}
