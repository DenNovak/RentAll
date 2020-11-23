import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {Booking} from "../../common/booking";

@Component({
  selector: 'app-consumer-free',
  templateUrl: './consumer-free.component.html',
  styleUrls: ['./consumer-free.component.scss']
})
export class ConsumerFreeComponent implements OnInit {

  appComponent: AppComponent;
  bookings: Booking[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listBookingsByConsumer(1, 'RETURNED').subscribe(
      data => {
        this.bookings = data;
      }
    );
  }

}
