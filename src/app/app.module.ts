import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductTableComponent } from './components/product-table/product-table.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProductListComponent,
    ProductTableComponent
  ],
  imports: [
    BrowserModule,
    ProductTableComponent,
    ProductListComponent,
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [ProductTableComponent],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
