import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  category: number;
  price: number;
  unit: string;
  availability: boolean;
  sale: boolean;
  discount: number;
  comments: string;
  owner: string;
  quantityInStock: number;
  quantityChange?: number;
  discountChange?: number;
  selectedSaleType?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/infoproducts/';
  private localUrl = 'http://localhost:8000/';
  constructor(private http: HttpClient) { }
  getDashboardData(): Observable<any> {
    return this.http.get<any>('/api/dashboard-data');
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByCategory(category: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => product.category === category)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // updateProductStock(productId: number, quantityChange: number): Observable<any> {
  //   const endpoint = quantityChange > 0 ? 'incrementStock' : 'decrementStock';
  //   const absChange = Math.abs(quantityChange);
  //   console.log(`${this.localUrl}${endpoint}/${productId}/${absChange}/`);

  //   return this.http.get(`${this.localUrl}${endpoint}/${productId}/${absChange}/`, {}).pipe(
  //     catchError(this.handleError));
  // }
  updateProductStock(productId: number, saleType: string, quantityChange: number): Observable<any> {
    const absChange = Math.abs(quantityChange);
    const endpoint = `${this.localUrl}transaction/${productId}/${saleType}/${absChange}/`;

    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  updateProductDiscount(productId: number, discountChange: number): Observable<any> {
    const endpoint = discountChange > 0 ? 'incrementDiscount' : 'decrementDiscount';
    const absChange = Math.abs(discountChange);

    return this.http.get(`${this.localUrl}/putonsale/${productId}/${absChange}/`, {}).pipe(
      catchError(this.handleError));
  }

  //problem
  getCategories(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>('categories');
  }
}
