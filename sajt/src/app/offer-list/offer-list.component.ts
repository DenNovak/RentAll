import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';
import {Product} from '../common/product';
import {ProductService} from '../services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {
  }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.ownersProducts('').subscribe( //todo
      data => {
        this.products = data;
      }
    );
  }

  createOffer() {
    this.router.navigate(['/offer']);
  }

}
