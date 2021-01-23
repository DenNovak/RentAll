import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Validators} from '@angular/forms';
import {Product} from '../common/product';
import {ProductService} from '../services/product.service';
import {ComboBoxComponent} from './combo-box/combo-box.component';
import {ExternalProduct} from '../common/ExternalProduct';
import {AppComponent} from '../app.component';
import {TokenStorageService} from '../_services/token-storage.service';
import {Router} from '@angular/router';
import {AlertService} from "../_alert";

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {

  product = new Product();
  cItems: string[];
  externalProducts: ExternalProduct[];
  imageInput: File = null;
  productImage: string;

  OfferForm = new FormGroup({
    name: new FormControl(this.product.name),
    price: new FormControl(this.product.unitPrice),
    firstName: new FormControl(this.product.firstName),
    phoneNumber: new FormControl(this.product.phoneNumber),
    city: new FormControl(this.product.city),
    category: new FormControl(this.product.category),
    productCondition: new FormControl(this.product.condition),
    userDescription: new FormControl(this.product.userDescription),
    description: new FormControl(this.product.description),
    imageInput: new FormControl(this.imageInput)
  });

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private alertService: AlertService) {
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
      this.imageInput = event.target.files[0];
    }
  }

  uploadFileToActivity() {
    if (!this.imageInput.type.startsWith('image')) {
      this.alertService.error('Only images allowed');
      return;
    }
    this.productService.postFile(this.imageInput, this.product.id).subscribe(data => {
      this.router.navigate(['/offers']);
    }, error => {
      console.log(error);
    });
  }

  addProduct() {
    this.product.active = true;
    this.product.name = this.OfferForm.get('name').value;
    this.product.unitPrice = this.OfferForm.get('price').value;
    this.product.firstName = this.OfferForm.get('firstName').value;
    this.product.phoneNumber = this.OfferForm.get('phoneNumber').value;
    this.product.city = this.OfferForm.get('city').value;
    this.product.category = this.OfferForm.get('category').value;
    this.product.condition = this.OfferForm.get('productCondition').value;
    this.product.userDescription = this.OfferForm.get('userDescription').value;
    this.product.description = this.OfferForm.get('description').value;
    if (this.OfferForm.valid) {

      // this.product.imageUrl = `assets/images/products/${this.imageInput}`
      this.productService.addProduct(this.product)
        .subscribe(data => {
          this.product = data;
          if (this.imageInput) {
            this.uploadFileToActivity();
          } else {
            this.router.navigate(['/offers']);
          }
        });
    }
  }

  fillProduct() {
    this.productService.searchExternalProduct(this.product.name).subscribe(data => {
      const pr = data.filter(p => p.name.includes(this.product.name))[0];
      // tslint:disable-next-line:max-line-length
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
    if (pr) {
      this.productImage = `${pr.photoLink}`;
      this.product.name = pr.name;

      // tslint:disable-next-line:max-line-length
      this.OfferForm.get('description').setValue(`Engine name: ${pr.markaSilnika}\nEngine volume: ${pr.pojemnoscSilnika}\nCutting width: ${pr.szerokoscKoszenia}\nHeight regulation: ${pr.regulacjaWysokosciKoszenia}\nBasket capacity: ${pr.pojemnoscKosza}`);
      this.OfferForm.get('name').setValue(pr.name);
    } else {
      this.OfferForm.get('name').setValue(filter);
    }
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.OfferForm.value);


  }


}

