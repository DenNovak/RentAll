import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {AppComponent} from '../app.component';
import {User} from '../common/user';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../_alert";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  appComponent: AppComponent;
  user: User;
  userId: number;

  constructor(private productService: ProductService, private route: ActivatedRoute, private alertService: AlertService) { }

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

  saveUser() {
    this.productService.editUser(this.userId, this.user).subscribe(data => {
      this.user = data;
      this.alertService.success('User updated');
    });
  }
}
