import {Component, OnInit} from '@angular/core';
import {AppComponent} from "../app.component";
import {ProductService} from "../services/product.service";
import {Product} from "../common/product";

@Component({
  selector: 'app-owner-products',
  templateUrl: './owner-products.component.html',
  styleUrls: ['./owner-products.component.scss']
})
export class OwnerProductsComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByOwner(1, 'RESERVED').subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
