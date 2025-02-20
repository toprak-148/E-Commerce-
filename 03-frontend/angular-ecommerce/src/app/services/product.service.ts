import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { HttpClient } from '@angular/common/http';
import { ProductCategory } from '../common/product-category';
@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl:string = 'http://localhost:8080/api/products'; // API URL
  private categoryUrl:string= 'http://localhost:8080/api/product-category';

  constructor(private http:HttpClient) { }




  getProductList(theCategoryId:number):Observable<Product[]>
  {
    // @TODO : need to build URL based on category id.
    const searchUrl:string = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string):Observable<Product[]> {

    // @TODO : need to build URL based on the keyword
    const searchUrl:string = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);

  }

  private getProducts(searchUrl:string):Observable<Product[]>
  {
    return this.http.get<GetResponseProduct>(searchUrl).pipe(
      map(response=>response._embedded.products)
    )

  }



  getProductCategories() :Observable<ProductCategory[]>{
    return this.http.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )

  }


  getProduct(theProductId: number):Observable<Product> {
    const queryUrl:string =`${this.baseUrl}/${theProductId}`;
    return this.http.get<Product>(queryUrl);
  }




}




interface GetResponseProduct{
  _embedded:{
    products:Product[];
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}
