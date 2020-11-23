import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UserComponent} from './user/user.component';
import {HomePageComponent} from './home-page/home-page.component';
import {RouterModule, Routes} from '@angular/router';
import {ViewCategoryModule} from './view-category/view-category.module';
import {CategoryComponent} from './view-category/category/category.component';
import {ProductListComponent} from './view-category/category/product-list/product-list.component';
import {ProductDetailsComponent} from './view-category/category/product-details/product-details.component';
import {OfferComponent} from './offer/offer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ComboBoxComponent} from "./offer/combo-box/combo-box.component";
import {SignupFormComponent} from "./user/signup-form/signup-form.component";
import {LoginFormComponent} from "./user/login-form/login-form.component";
import {authInterceptorProviders} from "./helpers/auth.interceptor";
import { OwnerProductsComponent } from './owner-products/owner-products.component';
import { ConsumerProductsComponent } from './consumer-products/consumer-products.component';
import { PrListComponent } from './owner-products/pr-list/pr-list.component';
import { PrcListComponent } from './consumer-products/prc-list/prc-list.component';
import { ReservedComponent } from './owner-products/reserved/reserved.component';
import { BookedComponent } from './owner-products/booked/booked.component';
import { FreeComponent } from './owner-products/free/free.component';
import { ConsumerReservedComponent } from './consumer-products/consumer-reserved/consumer-reserved.component';
import { ConsumerBookedComponent } from './consumer-products/consumer-booked/consumer-booked.component';
import { ConsumerFreeComponent } from './consumer-products/consumer-free/consumer-free.component';
import { MaterialModule } from './material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingItemComponent } from './booking-list/booking-item/booking-item.component';
import { ConsumerToReturnComponent } from './consumer-products/consumer-to-return/consumer-to-return.component';
import { OwnerToReturnComponent } from './owner-products/owner-to-return/owner-to-return.component';



const productRoutes: Routes = [
  // {path: 'citySearch/:keyword/products/:id', component: ProductDetailsComponent},
  {path: 'citySearch/:cityName', component: ProductListComponent},
  {path: ':id', component: BookingItemComponent},
  {path: 'product/:id', component: ProductDetailsComponent},
  // {path: ':id/products/:id', component: ProductDetailsComponent},
  //{path: 'search/:keyword/products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'categories/:id', component: ProductListComponent},
  {path: 'categories', component: ProductListComponent},
  {path: '', component: ProductListComponent},
  {path: '**', redirectTo: '/category', pathMatch: 'full'}
];

const ownerProductRoutes: Routes = [
  { path: '', redirectTo: 'booked', pathMatch: 'full' },
  {path: 'reserved', component: ReservedComponent},
  {path: 'booked', component: BookedComponent},
  {path: 'toret', component: OwnerToReturnComponent},
  {path: 'free', component: FreeComponent}
];

const consumerProductRoutes: Routes = [
  { path: '', redirectTo: 'booked', pathMatch: 'full' },
  {path: 'reserved', component: ConsumerReservedComponent},
  {path: 'booked', component: ConsumerBookedComponent},
  {path: 'toreturn', component: ConsumerToReturnComponent},
  {path: 'free', component: ConsumerFreeComponent}
];

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'user', component: UserComponent},
  {path: 'offer', component: OfferComponent},
  {path: 'category', component: CategoryComponent, children: productRoutes},
  {path: 'owner', component: OwnerProductsComponent, children: ownerProductRoutes},
  {path: 'consumer', component: ConsumerProductsComponent, children: consumerProductRoutes}
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomePageComponent,
    OfferComponent,
    ComboBoxComponent,
    SignupFormComponent,
    LoginFormComponent,
    OwnerProductsComponent,
    ConsumerProductsComponent,
    PrListComponent,
    PrcListComponent,
    ReservedComponent,
    BookedComponent,
    FreeComponent,
    ConsumerReservedComponent,
    ConsumerBookedComponent,
    ConsumerFreeComponent,
    BookingListComponent,
    BookingItemComponent,
    ConsumerToReturnComponent,
    OwnerToReturnComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ViewCategoryModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    MaterialModule,
    FontAwesomeModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
