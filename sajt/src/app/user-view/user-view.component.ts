import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import {User} from '../common/user';
import {ProductService} from '../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from "../_alert";

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
  yourOpinion: string;
  yourRating: number = 0;
  mouseUprating: number = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }
  constructor(private productService: ProductService, private route: ActivatedRoute, private alertService: AlertService,
              private router: Router) { }

  ngOnInit(): void {
    this.appComponent = this.productService.getAppComponent();
    this.userId = +this.route.snapshot.paramMap.get('id');
    this.loadUser();
  }
  loadUser() {
    this.productService.getUser(this.userId).subscribe(data => {
      this.user = data;
      this.ratings = Array(this.user.rating).fill(0).map((x, i) => i);
      this.ratings = Array(Math.round(this.user.rating)).fill(0).map((x, i) => i);
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

  sendOpinion() {
    this.productService.createOpinion(this.userId, this.yourOpinion, this.yourRating).subscribe(data => {
      this.alertService.success(data);
      window.location.reload();
    });
  }

  resetRatingMouse(index) {
    this.mouseUprating = 0;
  }

  setRatingMouse(index) {
    this.mouseUprating = index + 1;
  }

  getMouseRating() {
    if (this.mouseUprating >= this.yourRating) {
      return this.mouseUprating;
    }
    return this.yourRating;
  }

  getStarImage(index) {
    if (index < this.getMouseRating()) {
      return 'assets/images/star.png';
    }
    return 'assets/images/star_grey.png';
  }

  fixRating(index) {
    this.yourRating = index + 1;
  }

  hasOpinion() {
    return this.appComponent.userId === this.userId || this.user.opinions.find(o => o.authorId === this.appComponent.userId) !== undefined;
  }
}