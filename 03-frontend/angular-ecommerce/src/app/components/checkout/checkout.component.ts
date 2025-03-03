import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { start } from 'repl';
import { NEVER, never } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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

  countries:Country[] = [];
  shippingAddressStates:State[] = [];
  billingAddressStates:State[] = [];



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


    //populate countries
    this.formService.getCountries().subscribe(
      data=>{
        console.log("Retrieved countries : " + JSON.stringify(data));
        this.countries = data;
      }
    );




  }

  onSubmit()
  {

    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

  }



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




}
