import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[] = [];
  totalPrice:Subject<number> = new Subject<number>();
  totalQuantity:Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem:CartItem)
  {
    //* check if we already have the item in our cart
    let alreadyExistsInCart:boolean= false;
    let existingCartItem:CartItem | undefined = undefined;


    if(this.cartItems.length > 0 )
    {

       //* find the item in the cart based on item id
       for(let tempCartItem of this.cartItems)
       {
        if(tempCartItem.id == theCartItem.id)
        {
          existingCartItem = tempCartItem;
          break;
        }
       }
       //* check if we found it
       alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart)
    {
      //* increment the quantity
      existingCartItem.quantity +=1;

    }
    else{
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();



  }
  computeCartTotals()
  {
    let totalPriceValue :number = 0;
    let totalQuantityValue : number = 0;
    for(let currentCarItem of this.cartItems)
    {
      totalPriceValue += currentCarItem.quantity * currentCarItem.unitPrice;
      totalQuantityValue += currentCarItem.quantity;
    }


    //public thenew values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);


    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue,totalQuantityValue);

  }

  logCartData(totalPriceValue:number , totalQuantityValue:number)
  {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems)
    {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name} , quantity:${tempCartItem.quantity} , unitPrice:${tempCartItem.unitPrice},subTotalPrice:${subTotalPrice}`);
    }
    console.log(`totalPrice:${totalPriceValue.toFixed(2)}, totalQuantity:${totalQuantityValue}`);
    console.log('-----');

  }
}
