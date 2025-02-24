import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  cartItems:CartItem[] = [];
  totalPrice:number=0;
  totalQuantity:number = 0;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails()
  {
    //* get a handle to te cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //* subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity = data
    );

    //* compute cart total price and total quantity;
    this.cartService.computeCartTotals();

  }


  decrementQuantity(theCartItem: CartItem) {


    this.cartService.decrementQuantity(theCartItem);


  }


    incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem);

    }


    remove(theCartItem:CartItem)
    {
      this.cartService.remove(theCartItem);

    }

}
