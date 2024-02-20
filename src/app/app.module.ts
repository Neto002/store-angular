import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import ptBr from '@angular/common/locales/pt';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartDetailsComponent } from './components/cart/cart-details/cart-details.component';
import { CartStatusComponent } from './components/cart/cart-status/cart-status.component';
import { CheckoutComponent } from './components/forms/checkout/checkout.component';
import { ProductCategoryMenuComponent } from './components/product/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { SearchComponent } from './components/util/search/search.component';
import { ProductService } from './services/product/product.service';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbPagination,
    ReactiveFormsModule,
  ],
  providers: [
    ProductService,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
