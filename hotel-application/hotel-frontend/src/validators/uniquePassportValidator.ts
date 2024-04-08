import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function uniquePassportValidator(getPassportList: () => string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const value = control.value;
        if (getPassportList().indexOf(value) !== -1)
            return {uniquePassport: true};

        return null;
    };
}
