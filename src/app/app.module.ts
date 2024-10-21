import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductsTableComponent } from './products-table/products-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductListComponent,
    ProductsTableComponent
  ],
  imports: [
    BrowserModule,
    ProductsTableComponent,
    ProductListComponent,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [ProductsTableComponent],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
