import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.shopAppUrl+'/orders';


  constructor(private http:HttpClient) {

   }

   getOrderHistory(theEmail:string):Observable<GetResponseOrderHistory>
   {

    // need to build URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this.http.get<GetResponseOrderHistory>(orderHistoryUrl);


   }
}



interface GetResponseOrderHistory{

  _embedded:{
    orders:OrderHistory[];
  }
}
