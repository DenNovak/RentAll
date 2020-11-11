import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-consumer-booked',
  templateUrl: './consumer-booked.component.html',
  styleUrls: ['./consumer-booked.component.scss']
})
export class ConsumerBookedComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByConsumer(1, 'BOOKED').subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
