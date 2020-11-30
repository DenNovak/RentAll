import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Validators} from '@angular/forms';
import {Product} from '../common/product';
import {ProductService} from '../services/product.service';
import {ComboBoxComponent} from "./combo-box/combo-box.component";
import {ExternalProduct} from "../common/ExternalProduct";
import {AppComponent} from "../app.component";
import {TokenStorageService} from "../_services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  product = new Product();
  cItems: string[];
  externalProducts: ExternalProduct[];
  imageInput: string;
  productImage: string;

  OfferForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    unitPrice: [''],
    city: [''],
    imageUrl: [''],


  })

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
  }
  appComponent: AppComponent;

  ngOnInit(): void {
    this.loadProductList();
    this.appComponent = this.productService.getAppComponent();
    if (!this.appComponent.isLoggedIn) {
      this.router.navigate(['/user']);
    }
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.imageInput = event.target.files[0].name;
    }
  }

  addProduct() {
    this.product.active = true;
    this.product.imageUrl = `assets/images/products/${this.imageInput}`
    this.productService.addProduct(this.product)
      .subscribe(data => {
      })
    history.go(0);
  }

  fillProduct() {
    this.productService.searchExternalProduct(this.product.name).subscribe(data => {
      const pr = data.filter(p => p.name.includes(this.product.name))[0];
      this.product.description = `Engine name: ${pr.markaSilnika}\nEngine volume: ${pr.pojemnoscSilnika}\nCutting width: ${pr.szerokoscKoszenia}\nHeight regulation: ${pr.regulacjaWysokosciKoszenia}\nBasket capacity: ${pr.pojemnoscKosza}`;
      this.product.name = pr.name;
    });
  }

  loadProductList() {
    this.productService.searchExternalProduct(' ').subscribe(data => {
      this.cItems = data.map(exProduct => exProduct.name);
      this.externalProducts = data;
    });
  }

  selectFromExternal(filter: string) {
    const pr = this.externalProducts.filter(i => i.name === filter)[0];
    this.productImage = `https://mediaexpert.pl${pr.photoLink}`;
    this.product.name = pr.name;
    if (pr != null) {
      this.product.description = `Engine name: ${pr.markaSilnika}\nEngine volume: ${pr.pojemnoscSilnika}\nCutting width: ${pr.szerokoscKoszenia}\nHeight regulation: ${pr.regulacjaWysokosciKoszenia}\nBasket capacity: ${pr.pojemnoscKosza}`;
    }
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.OfferForm.value);


  }


}

