import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../common/product';
//import { ExternalProduct } from '../common/ExternalProduct';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/product-category';
import {ExternalProduct} from '../common/ExternalProduct';
import {AppComponent} from '../app.component';
import {ProductStatus} from '../common/productstatus';
import {ProductUnavailableView} from '../common/productunavailableview';
import {Booking} from '../common/booking';
import {User} from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private appComponent: AppComponent;

  private baseUrl = 'https://rentall.projektstudencki.pl:8080/api/products';

  private bookingUrl = 'https://rentall.projektstudencki.pl:8080/api/booking';

  private categoryUrl = 'https://rentall.projektstudencki.pl:8080/api/product_category';

  constructor(private httpClient: HttpClient) {
  }

  getProduct(theProductId: number): Observable<Product> {

    // URL based on product id
    const productUrl = `${this.baseUrl}/view/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getBooking(bookingId: number): Observable<Booking> {
    // URL based on booking id
    const url = `https://rentall.projektstudencki.pl:8080/api/booking/${bookingId}`;
    return this.httpClient.get<Booking>(url);
  }

  getUser(userId: number): Observable<User> {
    const url = `https://rentall.projektstudencki.pl:8080/api/user/${userId}`;
    return this.httpClient.get<User>(url);
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
    return this.httpClient.get<ExternalProduct[]>(`https://rentall.projektstudencki.pl:8080/api/externalProduct`).pipe(map(response => {
      return response;
    }));
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(filter: string, city: string, category: string): Observable<Product[]> {

    // need to build URL based on the keyword
    /*const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);*/
    return this.httpClient.get<GetResponseProductsPlain>(`${this.baseUrl}/available?filter=${filter}&city=${city}&category=${category}`).pipe(map(response => response.content));

  }

  // Owner's product list
  ownersProducts(theKeyword: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProductsPlain>(`${this.baseUrl}/owners`).pipe(map(response => response.content));

  }

  hasMyBookings(userId: number): Observable<any> {
    return this.httpClient.get<GetResponseProductsPlain>(`https://rentall.projektstudencki.pl:8080/api/booking/myByUser/${userId}`);
  }

  // DELETE product
  deleteProduct(productId: string): Observable<any> {
    const url = `${this.baseUrl}/${productId}`;
    return this.httpClient.delete(url);
  }

// RESERVE PRODUCT
  reserveProduct(theProductId: string, from: Date, to: Date): Observable<any> {
    const reserveUrl = `${this.baseUrl}/${theProductId}/book`;
    const headers = {'content-type': 'application/json'};
    const body = {expectedStart: from, expectedEnd: to};
    return this.httpClient.patch(reserveUrl, body, {headers: headers});
  }

// CANCEL RESERVATION
  cancelReservation(bookingId: string): Observable<any> {
    const reserveUrl = `${this.bookingUrl}/${bookingId}/cancel`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'false'};
    return this.httpClient.patch(reserveUrl, body, {headers: headers});
  }

  // BOOK PRODUCT
  bookProduct(bookingId: string): Observable<any> {
    const bookUrl = `${this.bookingUrl}/${bookingId}/confirmReservation`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'false'};
    return this.httpClient.patch(bookUrl, body, {headers: headers});
  }

  returnProductConsumer(bookingId: string): Observable<any> {
    const returnUrl = `${this.bookingUrl}/${bookingId}/return`;
    const headers = {'content-type': 'application/json'};
    const body = {active: 'true'};
    return this.httpClient.patch(returnUrl, body, {headers: headers});
  }

// CONFIRM RETURN PRODUCT
  returnProduct(bookingId: string): Observable<any> {
    const returnUrl = `${this.bookingUrl}/${bookingId}/confirmReturn`;
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

  listProductImages(productId: number, status: string): Observable<number[]> {
    const url = `${this.baseUrl}/${productId}/image/ids`;
    return this.httpClient.get<number[]>(url).pipe();
  }

  postFile(fileToUpload: File, productId: string): Observable<boolean> {
    const url = `${this.baseUrl}/${productId}/image`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient.post(url, formData).pipe(map(() => true));
  }

  postFileFromUrl(fileUrl: string, productId: string): Observable<boolean> {
    const url = `${this.baseUrl}/${productId}/imageFromUrl`;
    const body = {url: fileUrl};
    return this.httpClient.post(url, body).pipe(map(() => true));
  }

  listBookingsByConsumer(userId: number, status: string): Observable<Booking[]> {
    const url = `https://rentall.projektstudencki.pl:8080/api/booking/byConsumer?status=${status}`;
    return this.httpClient.get<GetResponseBookingsPlain>(url).pipe(map(response => {
      return response.content;
    }));
  }

  listBookingsByOwner(userId: number, status: string): Observable<Booking[]> {
    const url = `https://rentall.projektstudencki.pl:8080/api/booking/byOwner?status=${status}`;
    return this.httpClient.get<GetResponseBookingsPlain>(url).pipe(map(response => {
      return response.content;
    }));
  }

  editUser(userId: number, user: User): Observable<User> {
    const url = `https://rentall.projektstudencki.pl:8080/api/user/${userId}`;
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify(user);
    return this.httpClient.put<User>(url, body, {'headers': headers});
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

  changePassword(password: string, uuid: string): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = {
      'password': password,
      'uuid': uuid
    };
    console.log(body);
    return this.httpClient.post('https://rentall.projektstudencki.pl:8080/api/auth/resetPassword', body, {'headers': headers});
  }

  generatePasswordResetLink(email: string): Observable<any> {
    const headers = {'content-type': 'application/json'};
    const body = {
      'email': email
    };
    console.log(body);
    return this.httpClient.post('https://rentall.projektstudencki.pl:8080/api/auth/getChangePasswordLink', body, {'headers': headers});
  }

  //Create opinion
  createOpinion(userId: number, content: string, rating: number): Observable<any> {
    const url = `https://rentall.projektstudencki.pl:8080/api/user/opinion`;
    const headers = {'content-type': 'application/json'};
    const body = {userId: userId, content: content, rating: rating};
    return this.httpClient.post(url, body, {headers: headers});
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
  empty: boolean;
}

interface GetResponseBookingsPlain {
  content: Booking[];
  pageable: string;
  last: boolean;
  totalPages: bigint;
  totalElements: bigint;
  size: bigint;
  number: bigint;
  sort: Sort;
  numberOfElements: bigint;
  first: boolean;
  empty: boolean;
}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

interface GetResponseExternalProducts {
  products: ExternalProduct[];
}
