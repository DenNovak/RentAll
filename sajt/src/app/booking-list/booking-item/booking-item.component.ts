import { Component, OnInit } from '@angular/core';
import {Product} from '../../common/product';
import {AppComponent} from '../../app.component';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {Booking} from '../../common/booking';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss']
})
export class BookingItemComponent implements OnInit {
  booking: Booking = new Booking();
  product: Product = new Product();
  productStatus = 'FREE';
  productConsumer = 0;
  appComponent: AppComponent;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.route.paramMap.subscribe(() => {
      this.handleBookingDetails();
    });
  }

  handleBookingDetails() {

    // get the "id" param string. Convert string to a number using the + symbol
    const bookingId: number = +this.route.snapshot.paramMap.get('id');

    this.productService.getBooking(bookingId).subscribe(
      b => {
        this.booking = b;
        this.productService.getProduct(this.booking.productId).subscribe(data => {
          this.product = data;
          if (this.booking.bookingDate === null) {
            this.productStatus = 'RESERVED';
          } else if (this.booking.clientReturnDate === null) {
            this.productStatus = 'BOOKED';
          } else if (this.booking.returnDate === null) {
            this.productStatus = 'RETURNED_BY_CONSUMER';
          } else {
            this.productStatus = 'FREE';
          }
          this.productConsumer = b.userId;
        });
      }
    );
  }

  cancelProductReservation(bookingId: string) {
    this.productService.cancelReservation(bookingId).subscribe(
      result => {
        if (result === true) {
          alert('Product reservation cancelled');
          window.location.reload();
        } else {
          alert('Could not cancel product reservation');
        }
      }
    );
  }

  bookProduct(bookingId: string) {
    this.productService.bookProduct(bookingId).subscribe(
      result => {
        if (result === true) {
          alert('Product booked');
          window.location.reload();
        } else {
          alert('Product booking failed');
        }
      }
    );
  }

  returnProductConsumer(bookingId: string) {
    this.productService.returnProductConsumer(bookingId).subscribe(
      result => {
        if (result === true) {
          alert('Product returned');
          window.location.reload();
        } else {
          alert('Product return failed');
        }
      }
    );
  }

  returnProduct(bookingId: string) {
    this.productService.returnProduct(bookingId).subscribe(
      result => {
        if (result === true) {
          alert('Product return confirmed');
          window.location.reload();
        } else {
          alert('Product return failed');
        }
      }
    );
  }
}
