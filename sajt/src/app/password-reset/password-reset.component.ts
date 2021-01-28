import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {ProductService} from "../services/product.service";
import {AlertService} from "../_alert";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  appComponent: AppComponent;
  pass1: string;
  pass2: string;
  uuid: string;

  constructor(private productService: ProductService, private alertService: AlertService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.uuid = params['id'];
    });
  }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
  }

  changePassword() {
    if (this.pass1 !== this.pass2) {
      this.alertService.error('Passwords must be the same');
    } else {
      this.productService.changePassword(this.pass2, this.uuid).subscribe(data => {
        this.alertService.success('Password changed');
      }, error => {
        this.alertService.error('Passwords reset failed');
      });
    }
  }
}