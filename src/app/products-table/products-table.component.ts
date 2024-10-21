import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ProductService, Product } from '../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule  // Ajouter FormsModule ici
  ],
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price','discount_price','discount', 'quantityInStock', 'actions','comments'];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: number | null = null; // La catégorie sélectionnée
  categories = [
    { id: 0, name: 'Poissons' },
    { id: 1, name: 'Coquillages' },
    { id: 2, name: 'Crustacés' }
  ];
  selectedSaleType: string = "purchase"; // La catégorie sélectionnée
  saleTypes = [
    { id: 'purchase', name: 'ajout' },
    { id: 'sale', name: 'retrait-par-vente'},
    { id: 'unsold', name: 'retrait-par-invendus' }
  ];
  stockErrorMessages: { [key: number]: string } = {};
  discountErrorMessages: { [key: number]: string } = {};

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Méthode pour charger les produits depuis le service
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;

      },
      error: (err) => console.error('Erreur lors de la récupération des produits :', err)
    });
  }

  filterByCategory(): void {
    if (this.selectedCategory !== null) {
      this.filteredProducts = this.products.filter(product => product.category === this.selectedCategory);
    } else {
      this.filteredProducts = this.products; // Si aucune catégorie n'est sélectionnée, on affiche tous les produits
    }
  }

  validateStockChange(quantityChange: number): boolean {
    return quantityChange !== undefined && !isNaN(quantityChange) && quantityChange > 0;
  }

  // Méthode pour valider le discount avant mise à jour
  validateDiscountChange(discountChange: number): boolean {
    return discountChange !== undefined && !isNaN(discountChange) && discountChange >= 0 && discountChange <= 100;
  }

  // Méthode pour modifier le stock d'un produit et mettre à jour le tableau localement
  updateStock(productId: number, quantityChange: number, selectedSaleType: string): void {
    if (!this.validateStockChange(quantityChange)) {
      this.stockErrorMessages[productId] = 'Veuillez saisir une valeur numérique positive';
      return;
    }
    const product = this.products.find(p => p.id === productId);
    if(product?.selectedSaleType === undefined){
      this.stockErrorMessages[productId] = 'Veuillez selectionner un type de transaction';
      return;
    }
    console.log(product?.category);


    if (product && product.quantityInStock+quantityChange < 0) {
      console.log(product.quantityInStock-quantityChange);

      this.stockErrorMessages[productId] = 'Stock insuffisant';
      return;
    }


    this.productService.updateProductStock(productId, selectedSaleType, quantityChange).subscribe({
      next: () => {
        if (product) {
          if(selectedSaleType === 'purchase'){
            product.quantityInStock += quantityChange;
          }
          else {
            product.quantityInStock -= quantityChange;
          }
          product.quantityChange = undefined; // Réinitialise la quantité de changement
        }
        console.log(`Stock mis à jour pour le produit ID: ${productId}`);
        this.stockErrorMessages[productId] = '';
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du stock :', err);
        this.stockErrorMessages[productId] = 'Erreur lors de la mise à jour du stock.';
      }
    });
  }

  // Méthode pour modifier la promotion d'un produit et mettre à jour le tableau localement
  updateDiscount(productId: number, discountChange: number): void {
    if (!this.validateDiscountChange(discountChange)) {
      this.discountErrorMessages[productId] = 'Le pourcentage de réduction doit être entre 0 et 100';
      return;
    }

    this.productService.updateProductDiscount(productId, discountChange).subscribe({
      next: () => {
        const product = this.products.find(p => p.id === productId);
        if (product) {
          product.discount = discountChange;
          product.discountChange = undefined;
          product.discount_price = product.price * (1-product.discount/100);
        }
        console.log(`Promotion mise à jour pour le produit ID: ${productId}`);
        this.discountErrorMessages[productId] = '';
      },
      error: (err) => console.error('Erreur lors de la mise à jour de la promotion :', err)
    });
  }
  submitAll(): void {
    this.products.forEach(product => {
      // Vérifie si le stock ou la promotion ont été modifiés
      if (product.quantityChange !== undefined && product.quantityChange !== 0) {
        this.updateStock(product.id,  product.quantityChange,this.selectedSaleType );
      }
      if (product.discountChange !== undefined && product.discountChange !== product.discount) {
        this.updateDiscount(product.id, product.discountChange);
      }
    });
  }
}
