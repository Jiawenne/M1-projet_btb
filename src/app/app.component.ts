import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductsTableComponent } from "./products-table/products-table.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductListComponent, ProductTableComponent, CurrencyPipe, ProductsTableComponent, DashboardComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  totalProducts: number = 0;
  productsOnSale: number = 0;
  totalStockValue: number = 0;
  selectedTable: string = 'all';
  allProducts: any[] = [];
  categories: { id: number; name: string }[] = [];
  currentView: 'dashboard' | 'products' = 'products';

  showDashboard() {
    this.currentView = 'dashboard';
  }

  showProductsTable() {
    this.currentView = 'products';
  }
  constructor(private productService: ProductService) {}

  ngOnInit() {
    // this.loadProducts();
    // this.loadCategories();
  }

  // loadProducts() {
  //   this.productService.getProducts().subscribe(products => {
  //     this.allProducts = products;
  //     this.calculateDashboardData();
  //   });
  // }

  // loadCategories() {
  //   this.productService.getCategories().subscribe(categories => {
  //     this.categories = categories;
  //   });
  // }

  // calculateDashboardData() {
  //   this.totalProducts = this.allProducts.length;
  //   this.productsOnSale = this.allProducts.filter(p => p.discount > 0).length;
  //   this.totalStockValue = this.allProducts.reduce((total, p) => total + (p.price * p.stock), 0);
  // }

  // selectTable(table: string) {
  //   this.selectedTable = table;
  //   console.log('selected table：', this.selectedTable);
  // }

  // getFilteredProducts() {
  //   console.log('nombre de produits avant：', this.allProducts.length);
  //   if (this.selectedTable === 'all') {
  //     return this.allProducts;
  //   }
  //   const categoryId = this.categories.find(c => c.name === this.selectedTable)?.id;
  //   return this.allProducts.filter(p => p.category === categoryId);
  // }
}
