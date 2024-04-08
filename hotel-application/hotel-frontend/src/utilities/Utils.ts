// Класс Утилиты
import {AbstractControl, FormControl} from "@angular/forms";
import * as changeCase from 'change-case';

export class Utils {

    // проверка валидности контрола
    static isValidControl(control: AbstractControl<any>): boolean {
        if (!control.dirty)
            return true;
        return control.valid;
    }


    // преобразовать ключи объекта из snake_case в camelCase
    static convertSnakeToCamel(obj: any): any {
        if (typeof obj !== 'object' || obj === null)
            return obj;

        if (Array.isArray(obj))
            return obj.map((value) => this.convertSnakeToCamel(value));

        const result: any = {};

        for (const [key, value] of Object.entries(obj)) {
            const newKey = changeCase.camelCase(key);
            result[newKey] = this.convertSnakeToCamel(value);
        }

        return result;
    }

    // Преобразовать ключи объекта из camelCase в snake_case
    static convertCamelToSnake(obj: any): any {
        if (typeof obj !== 'object' || obj === null)
            return obj;

        if (Array.isArray(obj))
            return obj.map((value) => this.convertCamelToSnake(value));

        const result: any = {};

        for (const [key, value] of Object.entries(obj)) {
            const newKey = changeCase.snakeCase(key);
            result[newKey] = this.convertCamelToSnake(value);
        }

        return result;
    }
}
