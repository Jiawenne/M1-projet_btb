// sales-report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesReportService {
  private apiUrl = 'http://localhost:8000/sales-report/';

  constructor(private http: HttpClient) { }

  getSalesReport(timePeriod: string, category?: string, promotionType?: string): Observable<any> {
    let params: { [key: string]: string } = { time_period: timePeriod };
    if (category) params['category'] = category;
    if (promotionType) params['promotion_type'] = promotionType;

    return this.http.get(this.apiUrl, { params });
  }
}
