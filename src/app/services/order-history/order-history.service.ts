import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetResponseOrderHistory } from './../../common/get-response';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = environment.apiUrl + '/orders';

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}
