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
  {path: ':id', component: ProductDetailsComponent},
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
  {path: 'toreturn', component: OwnerToReturnComponent},
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
    ConsumerFreeComponent
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