import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { ProductService } from '../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './category/product-list/product-list.component';
import {RouterModule} from "@angular/router";
import { ProductCategoryMenuComponent } from './category/product-category-menu/product-category-menu.component';
import { SearchComponent } from './category/search/search.component';
import { ProductDetailsComponent } from './category/product-details/product-details.component';
import { CitySearchComponent } from './category/city-search/city-search.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    CategoryComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CitySearchComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    MatDatepickerModule,
    MatFormFieldModule
    MatFormFieldModule,
    FormsModule,
    FontAwesomeModule
  ],
  exports: [
    CategoryComponent,
    ProductListComponent
  ],
  providers: [ProductService]
})
export class ViewCategoryModule { }
