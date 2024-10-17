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
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/infoproducts/';
  private localUrl = 'http://localhost:8000/';
  constructor(private http: HttpClient) { }

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

  updateProductStock(productId: number, quantityChange: number): Observable<any> {
    const endpoint = quantityChange > 0 ? 'incrementStock' : 'decrementStock';
    const absChange = Math.abs(quantityChange);
    
    return this.http.put(`${this.localUrl}${endpoint}/${productId}/${absChange}/`, {}).pipe(
      catchError(this.handleError));
  }

  updateMultipleProductStocks(updates: { id: number, quantityChange: number }[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/stock`, { updates });
  }
}