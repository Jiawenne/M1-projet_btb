import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductTableComponent implements OnInit {
  @Input() category!: number;
  @Input() categoryName!: string;
  @Input() products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    if (!this.products.length) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.productService.getProductsByCategory(this.category).subscribe(
      products => this.products = products
    );
  }

  onQuantityChange(product: any) {
    if (product.quantityChange < 0 && Math.abs(product.quantityChange) > product.quantityInStock) {
      product.quantityChange = -product.quantityInStock;
      product.error = 'insufficient stock';
    } else {
      product.error = null;
    }
  }

  onDiscountChange(product: any) {
    if (product.discountChange < 0 && Math.abs(product.discountChange) > product.discount) {
      product.discountChange = -product.discount;
      product.error = 'invalid discount';
    } else {
      product.error = null;
    }
  }

  sendProductUpdate(product: any) {
    this.productService.updateProductStock(product.id, product.quantityChange).subscribe(
      response => {
        console.log('update success', response);

        product.quantityInStock += product.quantityChange;
        product.quantityChange = 0;
      },
      error => console.error('update failed', error)
    );

    this.productService.updateProductDiscount(product.id, product.discountChange).subscribe(
      response => {
        console.log('update discount success', response);
        product.discount += product.discountChange;
        product.discountChange = 0;
      },
      error => console.error('update discount failed', error)
    );

  }

  sendAllUpdates() {
    this.products.forEach(product => {
      if (product.quantityChange !== undefined && product.quantityChange !== 0) {
        this.sendProductUpdate(product);
      }
    });
  }
}
