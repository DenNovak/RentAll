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
  authorMap: Map<number, User> = new Map<number, User>();
  ratings: Array<number>;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.loadUser();
  }

  loadUser() {
    this.productService.getUser(this.userId).subscribe(data => {
      this.user = data;
      this.ratings = Array(this.user.rating).fill(0).map((x, i) => i);
      this.user.opinions.forEach(o => {
        this.productService.getUser(o.authorId).subscribe(author => {
          this.authorMap.set(o.authorId, author);
        });
      });
    });
  }

  counter(i: number) {
    return new Array(i);
  }
}
