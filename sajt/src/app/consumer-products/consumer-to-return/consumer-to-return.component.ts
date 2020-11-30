import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Booking} from "../../common/booking";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-consumer-to-return',
  templateUrl: './consumer-to-return.component.html',
  styleUrls: ['./consumer-to-return.component.scss']
})
export class ConsumerToReturnComponent implements OnInit {
  appComponent: AppComponent;
  bookings: Booking[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listBookingsByConsumer(1, 'READY_TO_RETURN').subscribe(
      data => {
        this.bookings = data;
      }
    );
  }

}
