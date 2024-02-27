import { FormControl, ValidationErrors } from '@angular/forms';

export class MyValidators {
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    if (control.value != null && control.value.trim().length === 0) {
      return { notOnlyWhitespace: true };
    }
    return null;
  }

  static notOnlyNumbers(control: FormControl): ValidationErrors | null {
    if (!/^\d+$/.test(control.value)) {
      return { notOnlyNumbers: true };
    }
    return null;
  }
}
