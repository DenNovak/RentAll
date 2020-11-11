import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {ProductService} from "../services/product.service";
import {Product} from "../common/product";

@Component({
  selector: 'app-consumer-products',
  templateUrl: './consumer-products.component.html',
  styleUrls: ['./consumer-products.component.scss']
})
export class ConsumerProductsComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByConsumer(1, 'RESERVED').subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
