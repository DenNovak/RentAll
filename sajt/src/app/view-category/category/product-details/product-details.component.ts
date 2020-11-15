import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from "../../../app.component";
import {NgbDate, NgbDatepicker, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();
  productStatus = 'FREE';
  productConsumer = 0;
  appComponent: AppComponent;
  from: NgbDateStruct;
  to: NgbDateStruct;
  faCalendar = faCalendarAlt;
  markDisabled: (date: NgbDate) => {};

  constructor(private productService: ProductService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
    this.disableDays()
  }

  disableDays() {
    this.markDisabled = (date: NgbDate) => true;
  }




  handleProductDetails() {

    // get the "id" param string. Convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    );
    this.productService.getProductStatus(theProductId).subscribe(
      data => { this.productStatus = data.status; }
    );
    this.productService.getProductConsumer(theProductId).subscribe(
      data => { this.productConsumer = data; }
    );
  }

  reserveProduct(id: string) {
    this.productService.reserveProduct(id).subscribe(
      result => {
        if (result === true) {
          alert('Product reserved');
          window.location.reload();
        } else {
          alert('Product reservation failed');
        }
      }
    );
  }

  cancelProductReservation(id: string) {
    this.productService.cancelReservation(id).subscribe(
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

  bookProduct(id: string) {
    this.productService.bookProduct(id).subscribe(
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

  returnProductConsumer(id: string) {
    this.productService.returnProductConsumer(id).subscribe(
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

  returnProduct(id: string) {
    this.productService.returnProduct(id).subscribe(
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
