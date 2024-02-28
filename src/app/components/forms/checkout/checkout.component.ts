import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../common/checkout/order';
import { OrderItem } from '../../../common/checkout/order-item';
import { Purchase } from '../../../common/checkout/purchase';
import { Country } from '../../../common/country';
import { MyValidators } from '../../../common/my-validators';
import { PaymentInfo } from '../../../common/payment/payment-info';
import { State } from '../../../common/state';
import { CartService } from '../../../services/cart/cart.service';
import { CheckoutService } from '../../../services/checkout/checkout.service';
import { MyFormService } from '../../../services/form/my-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  isSubmitButtonDisabled: boolean = false;

  checkoutFormGroup: FormGroup = new FormGroup({});

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  storage: Storage = sessionStorage;

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private myFormService: MyFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    const email: string = JSON.parse(this.storage.getItem('userEmail')!);

    this.setupPaymentForm();

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
        email: new FormControl(email, [
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
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(2),
        //   MyValidators.notOnlyWhitespace,
        // ]),
        // cardNumber: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]{16}'),
        // ]),
        // securityCode: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]{3}'),
        // ]),
        // expirationMonth: [''],
        // expirationYear: [''],
      }),
    });

    // const startMonth: number = new Date().getMonth() + 1;
    // this.myFormService
    //   .getCreditCardMonths(startMonth)
    //   .subscribe((data) => (this.creditCardMonths = data));

    // this.myFormService
    //   .getCreditCardYears()
    //   .subscribe((data) => (this.creditCardYears = data));

    this.myFormService.getCountries().subscribe((data) => {
      console.log('countries: ', data);
      this.countries = data;
    });
  }

  setupPaymentForm() {
    let elements = this.stripe.elements();

    this.cardElement = elements.create('card', { hidePostalCode: true });

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
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
      return;
    }

    // Set Up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Get cart items
    const cartItems = this.cartService.cartItems;

    // Create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(
      (cartItem) => new OrderItem(cartItem)
    );

    // Set up purchase
    let purchase: Purchase = new Purchase();

    // Populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populate purchase - shipping address
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // Populate purchase - billing address
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Compute payment info

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'BRL';

    this.paymentInfo.receiptEmail = purchase.customer.email;

    // If valid form then create intent, confirm payment and place order

    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.isSubmitButtonDisabled = true;
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry.value.code,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isSubmitButtonDisabled = false;
              } else {
                // Call REST API via CheckoutService

                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking: ${response.orderTrackingNumber}`
                    );

                    // Reset cart
                    this.resetCart();
                    this.isSubmitButtonDisabled = false;
                  },
                  error: (err: Error) => {
                    alert(`There was an error: ${err.message}`);
                    this.isSubmitButtonDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  resetCart() {
    // Reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // Reset form
    this.checkoutFormGroup.reset();

    // Navigate back to the products page
    this.router.navigateByUrl('/products');
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
