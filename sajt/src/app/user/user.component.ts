import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {TokenStorageService} from '../_services/token-storage.service';
import {AppComponent} from "../app.component";
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})



export class UserComponent implements OnInit {
  @ViewChild('cbutton') cbutton: ElementRef;

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  isLoginComponent = true;
  appComponent: AppComponent;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private productService: ProductService) {
  }

  ngOnInit() {
    this.appComponent = this.productService.getAppComponent();
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit() {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }

  login() {
    this.isLoginComponent = true;
    this.cbutton.nativeElement.style.left = '0px';
  }

  register() {
    this.isLoginComponent = false;
    this.cbutton.nativeElement.style.left = '110px';
  }

}
