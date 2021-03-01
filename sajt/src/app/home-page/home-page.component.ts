import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {ProductService} from "../services/product.service";


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  appComponent: AppComponent;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
  }

}

