import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Purchase } from '../../common/checkout/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = environment.apiUrl + '/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<PurchaseResponse> {
    return this.httpClient.post<PurchaseResponse>(this.purchaseUrl, purchase);
  }
}

interface PurchaseResponse {
  orderTrackingNumber: string;
}
