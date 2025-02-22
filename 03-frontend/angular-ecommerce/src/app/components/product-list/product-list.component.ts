import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products:Product[] = [];
  currentCategoryId:number = 1;
  previousCategoryId: number = 1;
  searchMode:boolean = false;
// new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElement:number = 10;

  previousKeyword:string = "";



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


     //*Check if we have a different category than previous
    //* Note : Angular will reuse a component if it is currentyl being viewed

    //* now get the product for the given category id
    //* then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId)
    {
      this.thePageNumber = 1;

    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.thePageNumber - 1 , this.thePageSize,this.currentCategoryId).subscribe(
    this.processResult());
  }

  updatePageSize(pageSize: string) {

    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProduct();

  }




  handleSearchProducts()
  {
    const theKeyword:string=this.route.snapshot.paramMap.get('keyword')!;

    //* if we have a different keyword than previous
    //* then set thePageNumber to 1

    if(this.previousKeyword != theKeyword)
    {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;


    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1 , this.thePageSize,theKeyword).subscribe(
      this.processResult()
    );

  }

  processResult(){
    return (data:any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElement = data.page.totalElement;
    };
  }




}
