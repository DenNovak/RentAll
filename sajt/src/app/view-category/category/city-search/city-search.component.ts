import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.scss']
})
export class CitySearchComponent implements OnInit {
  @Output() item = new EventEmitter<string>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doCitySearch(selectObject) {
    /*console.log(`value=${selectObject}`);
    this.router.navigateByUrl(`/category/search?city=${selectObject}`);*/
    if (selectObject !== 'Choose your Location') {
      this.item.emit(selectObject);
    } else {
      this.item.emit('');
    }
  }

}
