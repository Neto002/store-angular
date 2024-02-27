import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from '../../../common/country';
import { MyValidators } from '../../../common/my-validators';
import { State } from '../../../common/state';
import { CartService } from '../../../services/cart/cart.service';
import { MyFormService } from '../../../services/form/my-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private myFormService: MyFormService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern('[0-9]{8}'),
          MyValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern('[0-9]{8}'),
          MyValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          MyValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.myFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));

    this.myFormService
      .getCreditCardYears()
      .subscribe((data) => (this.creditCardYears = data));

    this.myFormService.getCountries().subscribe((data) => {
      console.log('countries: ', data);
      this.countries = data;
    });
  }

  reviewCartDetails(): void {
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')!.value);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log('is valid: ' + this.checkoutFormGroup.valid);
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName')!;
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName')!;
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email')!;
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street')!;
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city')!;
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state')!;
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country')!;
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode')!;
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street')!;
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city')!;
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state')!;
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country')!;
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode')!;
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType')!;
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard')!;
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber')!;
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode')!;
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup!.value.country.code;

    this.myFormService.getStates(countryCode).subscribe((data) => {
      console.log('states', data);

      if (formGroupName === 'shippingAddress') {
        this.shippingAdressStates = data;
      }
      if (formGroupName === 'billingAddress') {
        this.billingAdressStates = data;
      }

      formGroup!.get('state')!.setValue(data[0]);
    });
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAdressStates = this.shippingAdressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAdressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup: AbstractControl<any, any> =
      this.checkoutFormGroup.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value.expirationYear
    );

    let startMonth: number;

    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.myFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }
}
