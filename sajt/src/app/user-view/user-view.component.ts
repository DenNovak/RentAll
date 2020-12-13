import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import {User} from '../common/user';
import {ProductService} from '../services/product.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  appComponent: AppComponent;
  user: User;
  userId: number;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.loadUser();
  }

  loadUser() {
    this.productService.getUser(this.userId).subscribe(data => {
      this.user = data;
    });
  }
}
