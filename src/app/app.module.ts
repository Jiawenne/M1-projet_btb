import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductTableComponent } from './components/product-table/product-table.component';

@NgModule({
  imports: [
    BrowserModule,
    ProductTableComponent,
    ProductListComponent
  ],
  declarations: [
    ProductTableComponent
  ],
  exports: [ProductTableComponent],
  providers: [provideHttpClient()]
})
export class AppModule { }

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppModule),
    provideHttpClient()
  ]
});
