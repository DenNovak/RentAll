import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../common/product';

@Component({
  selector: 'app-pr-list',
  templateUrl: './pr-list.component.html',
  styleUrls: ['./pr-list.component.scss']
})
export class PrListComponent implements OnInit {
  @Input() products: Product[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
