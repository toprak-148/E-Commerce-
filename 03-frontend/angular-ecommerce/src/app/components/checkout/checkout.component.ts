import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { start } from 'repl';
import { NEVER, never } from 'rxjs';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup:FormGroup;


  totalPrice:number = 0.0;
  totalQuantity:number = 0;

  creaditCardYears:number[] = [];
  creditCardMonths:number[] = [];



  constructor(private formBuilder:FormBuilder,private formService:FormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstname:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']

      }),
      billingAddress:this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      creditCart:this.formBuilder.group({
        cardType:[''],
        nameOneCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:['']
      }),
    });


    //* populate credit card months */

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
        this.creaditCardYears = data;
      }
    );


  }

  onSubmit()
  {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);

  }



  copyShippingAddressToBillingAddress(event:any) {
      if(event.target.checked)
      {
        this.checkoutFormGroup.controls['billingAddress'].setValue(
          this.checkoutFormGroup.controls['shippingAddress'].value)


      }else{
        this.checkoutFormGroup.controls['billingAddress'].reset();

      }
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




}
