import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../common/product';
//import { ExternalProduct } from '../common/ExternalProduct';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/product-category';
import {ExternalProduct} from "../common/ExternalProduct";
import {AppComponent} from "../app.component";
import {ProductStatus} from "../common/productstatus";
import {ProductUnavailableView} from "../common/productunavailableview";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private appComponent: AppComponent;

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product_category';

  constructor(private httpClient: HttpClient) {
  }

  getProduct(theProductId: number): Observable<Product> {

    // URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductStatus(theProductId: number): Observable<ProductStatus> {
    const productUrl = `${this.baseUrl}/${theProductId}/status`;
    return this.httpClient.get<ProductStatus>(productUrl);
  }

  getProductConsumer(theProductId: number): Observable<number> {
    const productUrl = `${this.baseUrl}/${theProductId}/consumer`;
    return this.httpClient.get<number>(productUrl);
  }

  getCurrentUser(): Observable<number> {
    const productUrl = `${this.baseUrl}/currentUser`;
    return this.httpClient.get<number>(productUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts> {


    // need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  searchExternalProduct(productNameFilter: string) {
    return this.httpClient.get<ExternalProduct[]>(`http://localhost:8080/api/externalProduct`).pipe(map(response => {
      return response;
    }));
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword
    /*const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);*/
    return this.httpClient.get<GetResponseProductsPlain>(`${this.baseUrl}/available`).pipe(map(response => response.content));

  }

// RESERVE PRODUCT
  reserveProduct(theProductId: string): Observable<any> {
    const reserveUrl = `${this.baseUrl}/${theProductId}/book`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'false'};
    return this.httpClient.patch(reserveUrl, body, {headers: headers});
  }

// CANCEL RESERVATION
  cancelReservation(theProductId: string): Observable<any> {
    const reserveUrl = `${this.baseUrl}/${theProductId}/cancel`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'false'};
    return this.httpClient.patch(reserveUrl, body, {headers: headers});
  }

  // BOOK PRODUCT
  bookProduct(theProductId: string): Observable<any> {
    const bookUrl = `${this.baseUrl}/${theProductId}/get`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'false'};
    return this.httpClient.patch(bookUrl, body, {headers: headers});
  }

  returnProductConsumer(theProductId: string): Observable<any> {
    const returnUrl = `${this.baseUrl}/${theProductId}/returnConsumer`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'true'};
    return this.httpClient.patch(returnUrl, body, {headers: headers});
  }

// CONFIRM RETURN PRODUCT
  returnProduct(theProductId: string): Observable<any> {
    const returnUrl = `${this.baseUrl}/${theProductId}/return`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'true'};
    return this.httpClient.patch(returnUrl, body, {headers: headers});
  }

  listProductsByOwner(userId: number, status: string): Observable<Product[]> {
    const url = `${this.baseUrl}/createdByUser?status=${status}`;
    return this.httpClient.get<GetResponseProductsPlain>(url).pipe(map(response => response.content));
  }

  listUnavailableDates(theProductId: string): Observable<ProductUnavailableView[]> {
    const url = `${this.baseUrl}/${theProductId}/unavailable`;
    return this.httpClient.get<ProductUnavailableView[]>(url).pipe(map(response => response));
  }

  listProductsByConsumer(userId: number, status: string): Observable<Product[]> {
    const url = `${this.baseUrl}/gotByUser?status=${status}`;
    return this.httpClient.get<GetResponseProductsPlain>(url).pipe(map(response => response.content));
  }

  addProduct(product: Product): Observable<any> {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(product);
    console.log(body);
    return this.httpClient.post(this.baseUrl, body, {'headers': headers});
  }

  searchCityProducts(cityName: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCityContaining/?city=${cityName}`;

    return this.getProducts(searchUrl);
  }

  setAppComponent(ac: AppComponent) {
    this.appComponent = ac;
  }

  getAppComponent(): AppComponent {
    return this.appComponent;
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

interface GetResponseProductsPlain {
  content: Product[];
  pageable: string;
  last: boolean;
  totalPages: bigint;
  totalElements: bigint;
  size: bigint;
  number: bigint;
  sort: Sort;
  numberOfElements: bigint;
  first: boolean;
  empty: boolean
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

interface GetResponseExternalProducts {
  products: ExternalProduct[];
}
