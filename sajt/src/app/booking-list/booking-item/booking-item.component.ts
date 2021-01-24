import { Component, OnInit } from '@angular/core';
import {Product} from '../../common/product';
import {AppComponent} from '../../app.component';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Booking} from '../../common/booking';
import {AlertService} from "../../_alert";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss']
})
export class BookingItemComponent implements OnInit {
  booking: Booking = new Booking();
  start: string;
  end: string;
  product: Product = new Product();
  productStatus = 'FREE';
  productConsumer = 0;
  appComponent: AppComponent;
  currentImageId: number;
  imageCount = 0;
  currentImageIndex = 0;
  clientName: string;
  cancelPressed = false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute, private router: Router, private alertService: AlertService) { }

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
        this.start = formatDate(b.expectedStart, 'dd.MM.yyyy', 'en-US');
        this.end = formatDate(b.expectedEnd, 'dd.MM.yyyy', 'en-US');
        this.productService.getUser(this.booking.userId).subscribe(data => {
          this.clientName = data.firstName + ' ' + data.lastName;
        });
        this.productService.getProduct(this.booking.productId).subscribe(data => {
          this.product = data;
          if (this.product.imageIds && this.product.imageIds.length > 0) {
            this.currentImageId = this.product.imageIds[0];
            this.imageCount = this.product.imageIds.length;
          }
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
          this.alertService.success('Product reservation cancelled');
          this.cancelPressed = true;
          setTimeout(() => {
            this.router.navigate(['/consumer/reserved']);
          }, 2000);
        } else {
          this.alertService.error('Could not cancel product reservation');
        }
      }
    );
  }

  bookProduct(bookingId: string) {
    this.productService.bookProduct(bookingId).subscribe(
      result => {
        if (result === true) {
          this.alertService.success('Product booked');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.alertService.error('Product booking failed');
        }
      }
    );
  }

  returnProductConsumer(bookingId: string) {
    this.productService.returnProductConsumer(bookingId).subscribe(
      result => {
        if (result === true) {
          if (result === true) {
            this.alertService.success('Product returned');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            this.alertService.error('Product return failed');
          }
        }
      }
    );
  }

  returnProduct(bookingId: string) {
    this.productService.returnProduct(bookingId).subscribe(
      result => {
        if (result === true) {
          this.alertService.success('Product return confirmed');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.alertService.error('Product return failed');
        }
      }
    );
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.imageCount;
    if (this.imageCount && this.imageCount > 0) {
      this.currentImageId = this.product.imageIds[this.currentImageIndex];
    }
  }

  prevImage() {
    this.currentImageIndex--;
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.imageCount - 1;
    }
    if (this.imageCount && this.imageCount > 0) {
      this.currentImageId = this.product.imageIds[this.currentImageIndex];
    }
  }
}
