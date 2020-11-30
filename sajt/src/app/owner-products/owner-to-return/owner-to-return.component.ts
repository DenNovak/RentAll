import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Booking} from "../../common/booking";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-owner-to-return',
  templateUrl: './owner-to-return.component.html',
  styleUrls: ['./owner-to-return.component.scss']
})
export class OwnerToReturnComponent implements OnInit {
  appComponent: AppComponent;
  bookings: Booking[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listBookingsByOwner(1, 'READY_TO_RETURN').subscribe(
      data => {
        this.bookings = data;
      }
    );
  }

}