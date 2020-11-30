import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {Booking} from "../../common/booking";

@Component({
  selector: 'app-booked',
  templateUrl: './booked.component.html',
  styleUrls: ['./booked.component.scss']
})
export class BookedComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];
  bookings: Booking[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByOwner(1, 'BOOKED').subscribe(
      this.productService.listBookingsByOwner(1, 'BOOKED').subscribe(
        data => {
          this.products = data;
          this.bookings = data;
        }
      );
  }
}
