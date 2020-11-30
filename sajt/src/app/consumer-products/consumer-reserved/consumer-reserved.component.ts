import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import {Product} from '../../common/product';
import {ProductService} from '../../services/product.service';
import {Booking} from "../../common/booking";

@Component({
  selector: 'app-consumer-reserved',
  templateUrl: './consumer-reserved.component.html',
  styleUrls: ['./consumer-reserved.component.scss']
})
export class ConsumerReservedComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];
  bookings: Booking[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByConsumer(1, 'RESERVED').subscribe(
      this.productService.listBookingsByConsumer(1, 'RESERVED').subscribe(
        data => {
          this.products = data;
          this.bookings = data;
        }
      );
  }
}
