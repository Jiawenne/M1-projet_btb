import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTableComponent } from '../product-table/product-table.component';
import { ProductService } from '../../services/product.service';

interface Category {
  id: number;
  name: string;
  products?: any[]; 
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, ProductTableComponent]
})
export class ProductListComponent implements OnInit {
  categories: Category[] = [
    { id: 0, name: 'poissons' },
    { id: 1, name: 'crustaces' },
    { id: 2, name: 'coquillages' },
  ];
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.categories.forEach(category => {
          category.products = products.filter(p => p.category === category.id);
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }
}
