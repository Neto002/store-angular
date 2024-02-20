import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Country } from '../../../common/country';
import { State } from '../../../common/state';
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
    private myFormService: MyFormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
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

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')!.value);
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
