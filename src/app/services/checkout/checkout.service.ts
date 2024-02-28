import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Purchase } from '../../common/checkout/purchase';
import { PaymentInfo } from '../../common/payment/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = environment.apiUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.apiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) {}

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(
      this.paymentIntentUrl,
      paymentInfo
    );
  }

  placeOrder(purchase: Purchase): Observable<PurchaseResponse> {
    return this.httpClient.post<PurchaseResponse>(this.purchaseUrl, purchase);
  }
}

interface PurchaseResponse {
  orderTrackingNumber: string;
}
