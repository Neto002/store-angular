import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/checkout/order-history';
import { OrderHistoryService } from '../../services/order-history/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail')!);

    this.orderHistoryService.getOrderHistory(email).subscribe((data) => {
      this.orderHistoryList = data._embedded.orders;
    });
  }
}
