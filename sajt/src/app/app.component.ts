import {Component, OnInit} from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  userId: number = 0;
  username: string;

  constructor(private tokenStorageService: TokenStorageService, private productService: ProductService) { }

  ngOnInit() {
    this.productService.setAppComponent(this);
    this.productService.getCurrentUser().subscribe(
      data => { this.userId = data; }
    );

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
