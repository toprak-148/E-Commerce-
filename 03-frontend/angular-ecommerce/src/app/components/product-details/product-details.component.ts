import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {


  product:Product;


  constructor(private route:ActivatedRoute,private productService:ProductService,private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }


  handleProductDetails()
  {
    // get the id param string. convert stirng to a number using the '+' symbol
    const theProductId:number = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProduct(theProductId).subscribe(
      data=>{
        this.product = data;
      }
    )
  }
  addToCart()
  {
    console.log(`adding to cart :${this.product.name} , ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);

  }
}
