import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../../common/cart-item';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data != null) {
      this.cartItems = data;

      this.computeCartTotals();
    }
  }

  addToCart(itemToAdd: CartItem) {
    // check if item already exists in cart
    let existingCartItem: CartItem | undefined = this.findCartItem(itemToAdd);

    // check if found
    let alreadyExistsInCart: boolean = existingCartItem != undefined;

    if (alreadyExistsInCart) {
      // increment item quantity
      existingCartItem!.quantity++;
    } else {
      // simply add item to cartItems array
      this.cartItems.push(itemToAdd);
    }

    // compute cart total price and quantity
    this.computeCartTotals();
  }

  decrementQuantity(itemToRemove: CartItem) {
    itemToRemove.quantity--;

    if (itemToRemove.quantity === 0) {
      this.removeItem(itemToRemove);
    } else {
      this.computeCartTotals();
    }
  }

  removeItem(existingCartItem: CartItem) {
    // get index
    const itemIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.id === existingCartItem.id
    );

    // if found remove item from array
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  findCartItem(item: CartItem): CartItem | undefined {
    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      // find item in cart with id
      existingCartItem = this.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );
    }

    return existingCartItem;
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.persistCartItems();
  }
}
