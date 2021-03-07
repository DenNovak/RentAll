import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  city = '';
  category = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl(`/category/search?filter=&city=${this.city}&category=${this.category}`);
  }

  doSearch(filter: string, city: string, category: string) {
    console.log(`value=${filter}`);
    this.router.navigateByUrl(`/category/search?filter=${filter}&city=${city}&category=${category}`);
  }

  setCity($event: string) {
    this.city = $event;
  }

  doSetCategory(value: string) {
    if (value !== 'Choose category') {
      this.category = value;
    } else {
      this.category = '';
    }
  }
}
