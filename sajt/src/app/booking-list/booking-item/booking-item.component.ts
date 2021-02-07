import {Component, OnInit} from '@angular/core';
import {Product} from '../../common/product';
import {AppComponent} from '../../app.component';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Booking} from '../../common/booking';
import {AlertService} from "../../_alert";
import {formatDate} from "@angular/common";
import {User} from "../../common/user";

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss']
})
export class BookingItemComponent implements OnInit {
  booking: Booking = new Booking();
  user: User;
  ratings: Array<number>;
  yourOpinion: string;
  yourRating: number = 0;
  mouseUprating: number = 0;
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
              private route: ActivatedRoute, private router: Router, private alertService: AlertService) {
  }

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
          this.productService.getUser(this.product.userId).subscribe(user => {
            this.user = user;
            this.ratings = Array(Math.round(this.user.rating)).fill(0).map((x, i) => i);
          });
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
          this.sendOpinion();
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

  counter(i: number) {
    return new Array(i);
  }

  sendOpinion() {
    if (this.yourOpinion && this.yourOpinion.length > 0) {
      this.productService.createOpinion(this.product.userId, this.yourOpinion, this.yourRating).subscribe(data => {
      });
    }
  }

  resetRatingMouse(index) {
    this.mouseUprating = 0;
  }

  setRatingMouse(index) {
    this.mouseUprating = index + 1;
  }

  getMouseRating() {
    if (this.mouseUprating >= this.yourRating) {
      return this.mouseUprating;
    }
    return this.yourRating;
  }

  getStarImage(index) {
    if (index < this.getMouseRating()) {
      return 'assets/images/star.png';
    }
    return 'assets/images/star_grey.png';
  }

  fixRating(index) {
    this.yourRating = index + 1;
  }
}
