import {Component, Input, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  appComponent: AppComponent;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
  }

}
