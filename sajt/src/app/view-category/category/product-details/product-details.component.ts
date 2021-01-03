import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from '../../../app.component';
import {NgbDate, NgbDatepicker, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import {ProductUnavailableView} from '../../../common/productunavailableview';

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
  refusedDates: ProductUnavailableView[];
  totalCost = 0;
  currentImageId: number;
  imageCount = 0;
  currentImageIndex = 0;
  imageInput: File;

  constructor(private productService: ProductService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  disableDays() {
    this.markDisabled = (date: NgbDate) => {
      for (const interval of this.refusedDates) {
        if (interval.start === null || interval.end === null || interval.start === undefined || interval.end === undefined) {
          continue;
        }
        const start = new NgbDate(interval.start.getFullYear(), interval.start.getMonth() + 1, interval.start.getDate() - 1);
        const end = new NgbDate(interval.end.getFullYear(), interval.end.getMonth() + 1, interval.end.getDate() - 1);
        if ((date.after(start) || date.equals(start)) && (date.before(end) || date.equals(end))) {
          return true;
        }
      }
      return false;
    };
  }

  refreshCost(nVal: string, num: number) {
    const dt = new Date(nVal);
    const newVal = new NgbDate(dt.getFullYear(), dt.getMonth(), dt.getDate());
    let fr = null;
    let t = null;
    if (this.from != null) {
      fr = new NgbDate(this.from.year, this.from.month - 1, this.from.day - 1);
    }
    if (this.to != null) {
      t = new NgbDate(this.to.year, this.to.month - 1, this.to.day - 1);
    }
    if (num === 1) {
      fr = new NgbDate(newVal.year, newVal.month, newVal.day);
    } else {
      t = new NgbDate(newVal.year, newVal.month, newVal.day);
    }
    if (t.after(fr) || t.equals(fr)) {
      const diff = Math.abs(new Date(t.year, t.month, t.day).getTime() - new Date(fr.year, fr.month, fr.day).getTime());
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
      this.totalCost = this.product.unitPrice * diffDays;
      return;
    }
    this.totalCost = 0;
  }


  handleProductDetails() {

    // get the "id" param string. Convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        if (this.product.imageIds && this.product.imageIds.length > 0) {
          this.currentImageId = this.product.imageIds[0];
          this.imageCount = this.product.imageIds.length;
        }
        this.productService.listUnavailableDates(this.product.id).subscribe((d) => {
          this.refusedDates = d.map(rec => {
            const v = new ProductUnavailableView();
            v.start = new Date(rec.start);
            v.end = new Date(rec.end);
            return v;
          });
          this.disableDays();
        });
      }
    );
    this.productService.getProductStatus(theProductId).subscribe(
      data => {
        this.productStatus = data.status;
      }
    );
    this.productService.getProductConsumer(theProductId).subscribe(
      data => {
        this.productConsumer = data;
      }
    );
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe(result => {
      if (result) {
        this.router.navigate(['/category']);
      } else {
        alert('Failed to delete Product');
      }
    });
  }

  reserveProduct(id: string) {
    if (!this.checkDates()) {
      return;
    }
    const st = new Date(this.from.year, this.from.month - 1, this.from.day + 1);
    const f = new Date(this.to.year, this.to.month - 1, this.to.day + 1);
    this.productService.reserveProduct(id, st, f).subscribe(
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

  checkDates(): boolean {
    if (this.from === null || this.to === null || this.from === undefined || this.to === undefined) {
      alert('Fill reservation dates');
      return false;
    }
    if (this.refusedDates === null || this.refusedDates === undefined) {
      return true;
    }
    const fr = new NgbDate(this.from.year, this.from.month - 1, this.from.day - 1);
    const t = new NgbDate(this.to.year, this.to.month - 1, this.to.day - 1);
    for (const period of this.refusedDates) {
      const st = new NgbDate(period.start.getFullYear(), period.start.getMonth() - 1, period.start.getDate() - 1);
      const f = new NgbDate(period.end.getFullYear(), period.end.getMonth() - 1, period.end.getDate() - 1);
      if (this.isInInterval(fr, st, f) || this.isInInterval(t, st, f)) {
        alert('Selected date interval is not free');
        return false;
      }
    }
    return true;
  }

  isInInterval(d: NgbDate, s: NgbDate, f: NgbDate) {
    return (d.after(s) || d.equals(s)) && (d.before(f) || d.equals(f));
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

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.imageInput = event.target.files[0];
      this.uploadFileToActivity();
    }
  }

  uploadFileToActivity() {
    this.productService.postFile(this.imageInput, this.product.id).subscribe(data => {
      this.productService.getProduct(Number(this.product.id)).subscribe(data => {
        this.product = data;
        if (this.product.imageIds && this.product.imageIds.length > 0) {
          this.imageCount = this.product.imageIds.length;
          this.currentImageId = this.product.imageIds[this.imageCount - 1];
        }
      });
    }, error => {
      console.log(error);
    });
  }
}
