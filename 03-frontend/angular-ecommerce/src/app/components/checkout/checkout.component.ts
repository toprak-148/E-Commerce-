import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { todo } from 'node:test';
import { Observable } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup:FormGroup;


  totalPrice:number = 0.0;
  totalQuantity:number = 0;

  creditCardYears:number[] = [];
  creditCardMonths:number[] = [];

  countries:Country[] = [];
  shippingAddressStates:State[] = [];
  billingAddressStates:State[] = [];


  storage:Storage=sessionStorage;

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo:PaymentInfo = new PaymentInfo();

  cardElement:any;
  displayError : any = "";


  isDisabled:boolean = false;



  constructor(private formBuilder:FormBuilder,
              private formService:FormService,
              private cartService:CartService,
              private checkoutService:CheckoutService,
              private router : Router) { }

  ngOnInit(): void {

    // setup stripe payment form

    this.setupStripePaymentForm();


    this.reviewCartDetails();
    // read the user's email address from browser storage

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);




    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstname:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.notOnlyWhitespace]),
        lastName:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.notOnlyWhitespace]),
        email:new FormControl(this.email,
                              [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,
                                   Validators.minLength(2),
                                   ShopValidators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,
                                 Validators.minLength(2),
                                 ShopValidators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.notOnlyWhitespace])

      }),
      billingAddress:this.formBuilder.group({
        street:new FormControl('',[Validators.required,
                                   Validators.minLength(2),
                                   ShopValidators.notOnlyWhitespace]),
        city:new FormControl('',[Validators.required,
                                 Validators.minLength(2),
                                 ShopValidators.notOnlyWhitespace]),
        state:new FormControl('',[Validators.required]),
        country:new FormControl('',[Validators.required]),
        zipCode:new FormControl('',[Validators.required,Validators.minLength(2),ShopValidators.notOnlyWhitespace])

      }),
      creditCard:this.formBuilder.group({
        /*
        cardType:new FormControl('',[Validators.required]),
        nameOneCard:new FormControl('',[Validators.required,Validators.minLength(2)]),
        cardNumber:new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required , Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
        */

      }),
    });


    //* populate credit card months */
    //! stripe structure used
    /*
    const startMonth:number = new Date().getMonth() + 1;
    console.log('start month: ' + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log('Retreive credit card years : ' + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    */


    //populate countries
    this.formService.getCountries().subscribe(
      data=>{
        console.log("Retrieved countries : " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }
  setupStripePaymentForm() {
    //* get a handle to stripe element
    var element = this.stripe.elements();

    //* create a card element .. and hide the zip-code field
    this.cardElement = element.create('card',{hidePostalCode:true});

    //* add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    //* add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event:any)=>{
      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if(event.complete)
      {
        this.displayError.textContent= "";
      }else if(event.error){
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    });

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName')?.value;}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName')?.value;}
  get email(){return this.checkoutFormGroup.get('customer.email')?.value;}


  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street')?.value}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city')?.value}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state')?.value}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode')?.value}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country')?.value}


  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street')?.value}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city')?.value}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state')?.value}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode')?.value}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country')?.value}


  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType')?.value}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard')?.value}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber')?.value}
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode')?.value}






  copyShippingAddressToBillingAddress(event:any) {
      if(event.target.checked)
      {
        this.checkoutFormGroup.controls['billingAddress'].setValue(
          this.checkoutFormGroup.controls['shippingAddress'].value);

          // bug fix code
        this.billingAddressStates = this.shippingAddressStates;


      }else{
        this.checkoutFormGroup.controls['billingAddress'].reset();

        // bug fix for stated
        this.billingAddressStates = [];

      }
    }


    onSubmit()
    {
      console.log('Handling the submit button');

      if(this.checkoutFormGroup.invalid)
      {
        this.checkoutFormGroup.markAllAsTouched();
        return;
      }

      //* set up order
      let order = new Order();
      order.totalPrice = this.totalPrice;
      order.totalQuantity = this.totalQuantity;


      //* get cart items
      const cartItems = this.cartService.cartItems;



      //* create orderItems from cartItems
      const orderItems : OrderItem[] = [];
      //* for(let i = 0 ;i < cartItems.length;i++)
      //*   orderItems[i] = new OrderItem(cartItems[i]);
      // daha kısa bir yolu var
      let orderItemsShort:OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));


      //* set up purchase
      let purchase:Purchase = new Purchase();


      //* populate purchase - customer
      purchase.customer = this.checkoutFormGroup.controls['customer'].value;


      //* populate purchase - shipping address
      purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
      const shippingState:State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry:Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;

      //* populate purchase - billing address
      purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
      const billingState:State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry:Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;

      //* populate purchase - order and orderItems
      purchase.order = order;
      purchase.orderItem = orderItems;

      // compute payment info
      this.paymentInfo.amount = Math.round(this.totalPrice * 100);
      this.paymentInfo.currency = 'USD';
      this.paymentInfo.receiptEmail = purchase.customer.email;



      //* if valid form then
      //* - create payment intent
      //* - confirm card payment
      //* - place order

      if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "")
      {
        this.isDisabled = true;
        this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
          (paymentIntentResponse)=>{
            this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
              {
                payment_method:{
                  card:this.cardElement,
                  billing_details:{
                    email:purchase.customer.email,
                    name:`${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address:{
                      linel:purchase.billingAddress.street,
                      city:purchase.billingAddress.state,
                      postal_code:purchase.billingAddress.zipCode,
                      country:this.billingAddressCountry.value.code
                    }
                  }
                }
              },{handleActions:false}

            )
            .then((result:any)=>{
              if(result.error){
                // inform the customer there was an error
                alert(`There was an error : ${result.error.message}`);
                this.isDisabled = false;
              }
              else{
                // call REST API via the checkoutService
                this.checkoutService.placeOrder(purchase).subscribe(
                   {
                    next:(response:any)=>{
                      alert(`Your order has been received.\nOrder tracking number:${response.orderTrackingNumber}`);
                      //reset card
                      this.resetCart();
                      this.isDisabled = false;

                    },
                    error:(err:any)=>{
                      alert(`There was an error : ${err.message}`);
                      this.isDisabled = false;
                    }
                   }


                );
              }
            });
          }
        );
      }else{
        this.checkoutFormGroup.markAllAsTouched();
        return;

      }



      //* call REST API via the CheckoutService
      this.checkoutService.placeOrder(purchase).subscribe(
        {
          next:response=>{
            alert(`Your order has been received\nOrder tracking number: ${response.orderTrackingNumber}`);
            // reset cart
            this.resetCart();

          },
          error: err =>{
            alert(`There was an error:${err.message}`);
          }
        }
      )




    }


    resetCart(){
      // reset cart data
      this.cartService.cartItems = [];
      this.cartService.totalPrice.next(0);
      this.cartService.totalQuantity.next(0);
      this.cartService.persistCartItems();

      // reset the form
      this.checkoutFormGroup.reset();

      // navigate back to the products page
      this.router.navigateByUrl("/products")
    }


    handleMonthsAndYears() {
      const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

      const currentYear: number = new Date().getFullYear();
      const selectedYear:number = Number(creditCardFormGroup?.value.expirationYear);

      let startMonth:number;

      if(currentYear === selectedYear)
      {
        startMonth = new Date().getMonth() + 1;
      }

      else{
        startMonth = 1;
      }

      this.formService.getCreditCardMonths(startMonth).subscribe(
        data=>{
          console.log('Retrieved credit card months : ' + JSON.stringify(data));
          this.creditCardMonths = data;
        }
      );

    }


    getStates(formGroupName: string) {

      const formGroup :FormGroup |any= this.checkoutFormGroup.get(formGroupName);

      const countryCode = formGroup?.value.country.code;
      const countryName = formGroup?.value.country.name;
      console.log(`${formGroupName} country code : ${countryCode}`);
      console.log(`${formGroupName} country name : ${countryName}`);

      this.formService.getStates(countryCode).subscribe(
        data=>{

          if(formGroupName === 'shippingAddress')
          {
            this.shippingAddressStates = data;
          }
          else
          {
            this.billingAddressStates = data;
          }

          // select first item by default
          formGroup.get('state').setValue(data[0]);

        }
      );
    }


    reviewCartDetails()
    {
      //subscribe to cartService.totalQuantity

      this.cartService.totalQuantity.subscribe(
        totalQuantity=>{
            this.totalQuantity = totalQuantity;

        }
      )

      // subscribe to cartService.totalPrice
      this.cartService.totalPrice.subscribe(
        totalPrice =>{
          this.totalPrice = totalPrice;
        }
      )
    }

}
