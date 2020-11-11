import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-consumer-free',
  templateUrl: './consumer-free.component.html',
  styleUrls: ['./consumer-free.component.scss']
})
export class ConsumerFreeComponent implements OnInit {

  appComponent: AppComponent;
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByConsumer(1, 'RETURNED').subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
