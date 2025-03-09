import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { HttpClient } from '@angular/common/http';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl:string = environment.shopAppUrl+'/products'; // API PRODUCTS URL
  private categoryUrl:string= environment.shopAppUrl+'/product-category'; // API PRODUCT CATEGORY URL

  constructor(private http:HttpClient) { }



  getProduct(theProductId: number):Observable<Product> {
    const queryUrl:string =`${this.baseUrl}/${theProductId}`;
    return this.http.get<Product>(queryUrl);
  }



  getProductListPaginate(thePage:number,
                        thePageSize:number,
                        theCategoryId:number):Observable<GetResponseProduct>{
    // @TODO : need to build URL based on category id , page and size.
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;
    return this.http.get<GetResponseProduct>(searchUrl);
  }



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

    searchProductsPaginate(thePage:number,
                           thePageSize:number,
                          theKeyword:string):Observable<GetResponseProduct>{
    // @TODO : need to build URL based on keyword, page and size
    const searchUrl:string = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.http.get<GetResponseProduct>(searchUrl);
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





}




interface GetResponseProduct{
  _embedded:{
    products:Product[];
  }
  page:{
    size:number;
    totalElement:number;
    totalPages:number;
    number:number;
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCategory[];
  }
}
