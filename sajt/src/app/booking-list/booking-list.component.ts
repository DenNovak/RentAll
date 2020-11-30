import {Component, Input, OnInit} from '@angular/core';
import {Booking} from '../common/booking';
import { Product } from '../common/product';
import {ProductService} from '../services/product.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  @Input() bookings: Booking[] = [];
  products = new Map();
  loaded = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    for (const booking of this.bookings) {
      this.productService.getProduct(booking.productId).subscribe(p => {
        this.products.set(booking.id, p);
        if (this.products.size >= this.bookings.length) {
          this.loaded = true;
        }
      });
    }
  }

}
