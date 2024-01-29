import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../common/product';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: Product[] = [];
  currentCategoryId: number = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    this.productService
      .getProductList(this.currentCategoryId)
      .subscribe((data) => {
        this.products = data;
        console.log(this.products);
      });
  }
}
