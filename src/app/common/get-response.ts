import { OrderHistory } from './checkout/order-history';
import { Country } from './country';
import { Product } from './product';
import { ProductCategory } from './product-category';
import { State } from './state';

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: Page;
}

export interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
  page: Page;
}

export interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
  page: Page;
}

export interface GetResponseStates {
  _embedded: {
    states: State[];
  };
  page: Page;
}

export interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
  page: Page;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
