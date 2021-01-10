import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";
import {ProductService} from "../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../_alert";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  appComponent: AppComponent;
  email: string;

  constructor(private productService: ProductService, private route: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
  }

  generateLink() {
    this.productService.generatePasswordResetLink(this.email).subscribe(data => {
      this.alertService.success('Password change link was sent at your email');
    }, error => {
      this.alertService.error('Failed to generate password change link');
    });
  }
}
