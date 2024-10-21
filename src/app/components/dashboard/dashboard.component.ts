import { Component, OnInit } from '@angular/core';
import { SalesReportService } from '../../sales-reports.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  salesData: any[] = [];
  timePeriod = 'month';
  category = '';
  promotionType = '';
  totalProducts: number = 0;
  productsOnSale: number = 0;
  totalStockValue: number = 0;
  selectedTable: string = 'all';

  constructor(private salesReportService: SalesReportService) { }

  ngOnInit() {
    this.loadSalesData();
    this.loadProductData();
    setInterval(() => this.loadSalesData(), 60000);
    console.log('Dashboard initialized');
  }

  loadSalesData() {
    this.salesReportService.getSalesReport(this.timePeriod, this.category, this.promotionType)
      .subscribe(data => {
        this.salesData = data;
      });
  }

  loadProductData() {
    // 实现加载产品数据的逻辑
  }

  onFilterChange() {
    this.loadSalesData();
  }

  selectTable(table: string) {
    this.selectedTable = table;
  }

  getFilteredProducts() {
    // 实现过滤产品的逻辑
    return [];
  }
}