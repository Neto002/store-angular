import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetResponseProductCategory,
  GetResponseProducts,
} from '../../common/get-response';
import { Product } from '../../common/product';
import { ProductCategory } from '../../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'http://localhost:8080/api/products';
  private productCategoriesUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(
    page: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponseProducts> {
    const url =
      `${this.productsUrl}/search/findByCategoryId` +
      `?id=${categoryId}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${productId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductCategoriesList(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.productCategoriesUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  searchProductsPaginate(
    page: number,
    pageSize: number,
    keyword: string
  ): Observable<GetResponseProducts> {
    const searchUrl =
      `${this.productsUrl}/search/findByNameContaining` +
      `?name=${keyword}&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
}
