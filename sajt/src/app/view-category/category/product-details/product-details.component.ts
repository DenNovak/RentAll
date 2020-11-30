import {Component, OnInit} from '@angular/core';
import {Product} from 'src/app/common/product';
import {ProductService} from 'src/app/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from "../../../app.component";


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


  constructor(private productService: ProductService,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

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
}
