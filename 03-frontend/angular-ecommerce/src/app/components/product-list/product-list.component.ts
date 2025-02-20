import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[] = [];
  currentCategoryId:number = 0;
  searchMode:boolean;

  constructor(private productService:ProductService,private route:ActivatedRoute) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
      {this.listProduct();}
    );


  }




  listProduct()
  {
    this.searchMode = this.route.snapshot.paramMap.has(('keyword'));
    if(this.searchMode)
      this.handleSearchProducts();
    else
    this.handleListProducts();

  }


  handleListProducts(){

     //check if 'id' parameter available
     const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

     if(hasCategoryId){
       this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));
     }else{
       // not category id available ..default to category id 1
       this.currentCategoryId = 1;

     }
     this.productService.getProductList(this.currentCategoryId).subscribe(response=>{
       this.products = response;
     })

  }


  handleSearchProducts()
  {
    const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;

    //now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products = data;
      }
    )
  }




}
