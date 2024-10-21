import { Component, OnInit } from '@angular/core';
import { ProductService, Transaction } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MatTableModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  // Metrics
  totalRevenue: number = 0;
  totalCosts: number = 0;
  margin: number = 0;
  tax: number = 0;

  // Filters
  selectedCategory: number | null = null; // Filtrer par catégorie
  selectedTimePeriod: string = 'year'; // 'year', 'month', 'week', 'day'

  categories = [
    { id: 0, name: 'Poisson' },
    { id: 1, name: 'Fruits de Mer' },
    { id: 2, name: 'Crustacés' }
  ];
  displayedColumns: string[] = ['name', 'price', 'discount', 'quantityInStock', 'actions'];

  previousMargins: number[] = []; 
  isExceptionalMargin: boolean = false;

  constructor(private transactionService: ProductService) { }

  ngOnInit(): void {
    this.fetchTransactions();
    this.previousMargins = [100000, 120000, 80000, 150000, 110000, 90000];    // pour tester    faut preciser les montants
  }

  fetchTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data: Transaction[]) => {
        this.transactions = data;
        this.filterTransactions();
      },
      error: (err) => console.error('Erreur lors de la récupération des transactions :', err)
    });
  }

  filterTransactions(): void {
    const now = new Date();

    // Filtrage par catégorie
    this.filteredTransactions = this.transactions.filter(transaction => {
      if (this.selectedCategory !== null && transaction.product.category !== this.selectedCategory) {
        return false;
      }

      // Filtrage par période
      const transactionDate = new Date(transaction.date);
      const timeDifference = now.getTime() - transactionDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      if (this.selectedTimePeriod === 'year' && daysDifference > 365) {
        return false;
      } else if (this.selectedTimePeriod === 'month' && daysDifference > 30) {
        return false;
      } else if (this.selectedTimePeriod === 'week' && daysDifference > 7) {
        return false;
      } else if (this.selectedTimePeriod === 'day' && daysDifference > 1) {
        return false;
      }

      return true;
    });

    this.calculateMetrics();
  }

  calculateMetrics(): void {
    this.totalRevenue = 0;
    this.totalCosts = 0;
    this.margin = 0;
    this.tax = 0;
    
    this.filteredTransactions.forEach(transaction => {
      console.log(transaction);
      
      if (transaction.sale_type === 'sale') {
        const revenue = transaction.price * transaction.quantity;
        this.totalRevenue += revenue;
      } else if (transaction.sale_type === 'purchase') {
        const cost = transaction.price * transaction.quantity;
        this.totalCosts += cost;
      }
    });

    this.margin = this.totalRevenue - this.totalCosts;
    if (this.margin > 0) {
      this.tax = this.margin * 0.30;  // 30% d'impôt sur les bénéfices
    }

    this.checkExceptionalMargin();
  }

  checkExceptionalMargin(): void {
    if (this.previousMargins.length >= 6) {
      const averagePreviousMargin = this.previousMargins.slice(-6).reduce((sum, margin) => sum + margin, 0) / 6;
      this.isExceptionalMargin = this.margin >= averagePreviousMargin * 2;
      if (this.isExceptionalMargin) {
        this.launchConfetti();
      }
    }
  }

  launchConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value ? Number(selectElement.value) : null;
    this.filterTransactions();
  }

  onTimePeriodChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTimePeriod = selectElement.value;
    this.filterTransactions();
  }
}
