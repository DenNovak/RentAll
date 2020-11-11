import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../../app.component";
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-reserved',
  templateUrl: './reserved.component.html',
  styleUrls: ['./reserved.component.scss']
})
export class ReservedComponent implements OnInit {
  appComponent: AppComponent;
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.productService.listProductsByOwner(1, 'RESERVED').subscribe(
      data => {
        this.products = data;
      }
    );
  }

}
