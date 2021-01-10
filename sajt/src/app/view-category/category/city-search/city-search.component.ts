import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.scss']
})
export class CitySearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doCitySearch(selectObject) {

    console.log(`value=${selectObject}`);
    this.router.navigateByUrl(`/category/citySearch/${selectObject}`);
  }

}
