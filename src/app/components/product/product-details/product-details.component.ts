import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../../common/cart-item';
import { Product } from '../../../common/product';
import { CartService } from '../../../services/cart/cart.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(productId).subscribe((data) => {
      this.product = data;
      console.log('Product: ', data);
    });
  }

  addToCart() {
    console.log(
      `Adding to cart: ${this.product.name}, ${this.product.unitPrice}`
    );

    const cartItem = new CartItem(this.product);

    this.cartService.addToCart(cartItem);
  }
}
