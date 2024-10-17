import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class ProductTableComponent implements OnInit {
  @Input() category!: number;
  @Input() categoryName!: string;
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductsByCategory(this.category).subscribe(
      products => this.products = products
    );
    
  }

  onQuantityChange(product: any) {
    console.log('quantity change', product.quantityChange);
    if (product.quantityChange < 0 && Math.abs(product.quantityChange) > product.quantityInStock) {
      product.quantityChange = -product.quantityInStock;
    }
  }

  sendProductUpdate(product: any) {
    if (product.quantityChange === 0 || product.quantityChange === undefined) return
    this.productService.updateProductStock(product.id, product.quantityChange).subscribe(
      response => {
        console.log('update success', response);

        product.quantityInStock += product.quantityChange;
        product.quantityChange = 0;
      },
      error => console.error('update failed', error)
    );
  }

  sendAllUpdates() {
    console.log("this.products");
    this.products.forEach(product => product!=undefined && this.sendProductUpdate(product));

    
   
  }
}
