import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  revenue: number = 0;
  profit: number = 0;
  tax: number = 0;
  quarterlyProfits: number[] = [];
  showAlert: boolean = false;
  showCelebration: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadDashboardData();
    setInterval(() => this.loadDashboardData(), 60000);
  }

  loadDashboardData() {
    this.productService.getDashboardData().subscribe(
      data => {
        this.revenue = data.revenue;
        this.profit = data.profit;
        this.tax = data.tax;
        this.quarterlyProfits = data.quarterlyProfits;
        this.checkAlerts();
      },
      error => console.error('dashboard data failed to load', error)
    );
  }

  checkAlerts() {
    const currentQuarterProfit = this.quarterlyProfits[this.quarterlyProfits.length - 1];
    if (currentQuarterProfit < 0) {
      this.showAlert = true;
    } else {
      this.showAlert = false;
    }

    const lastSixQuarters = this.quarterlyProfits.slice(-7, -1);
    const averageProfit = lastSixQuarters.reduce((a, b) => a + b, 0) / lastSixQuarters.length;
    if (currentQuarterProfit > averageProfit * 2) {
      this.showCelebration = true;
    } else {
      this.showCelebration = false;
    }
  }
}
