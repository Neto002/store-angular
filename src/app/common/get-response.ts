import { Product } from './product';
import { ProductCategory } from './product-category';

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
