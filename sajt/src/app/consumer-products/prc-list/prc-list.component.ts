import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../common/product';

@Component({
  selector: 'app-prc-list',
  templateUrl: './prc-list.component.html',
  styleUrls: ['./prc-list.component.scss']
})
export class PrcListComponent implements OnInit {
  @Input() products: Product[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
