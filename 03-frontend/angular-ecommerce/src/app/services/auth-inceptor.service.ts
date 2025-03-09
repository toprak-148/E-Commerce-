import { Injectable ,Inject} from '@angular/core';
import { HttpEvent,HttpHandler,HttpInterceptor,HttpRequest } from '@angular/common/http';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import {from,lastValueFrom,Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

 //HttpInceptor : On ucta giris yapilmadan sipraris gecmislerini gormeyi engelleyen yapiyi olusturmak icin kullanilir.
export class AuthInceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth) {


   }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(this.handleAccess(request,next));
   }


  /*
  async, bir fonksiyonun asenkron çalışacağını belirtir.
   JavaScript ve TypeScript'te, async olarak tanımlanan fonksiyonlar otomatik olarak bir Promise döner.
    Yani, fonksiyonun içinde await kullanabiliriz ve
     fonksiyon çağrıldığında bir Promise döndürerek asenkron işlemler yapmamıza olanak tanır.

Bir Promise, gelecekte tamamlanacak bir işlemi temsil eden bir nesnedir. Üç durumu vardır:

Pending (Beklemede) → İşlem devam ediyor.
Resolved (Başarılı) → İşlem başarılı tamamlandı (.then() ile sonuç alınabilir).
Rejected (Hata Aldı) → İşlem başarısız oldu (.catch() ile hata yakalanabilir).


async, fonksiyonun bir Promise döndürmesini sağlar.
Promise, asenkron işlemlerin sonucunu temsil eden bir nesnedir.
handleAccess fonksiyonu, HTTP isteklerini asenkron olarak işleyerek bir HttpEvent döndürüyor.

The async keyword indicates that a function will run asynchronously.
In JavaScript and TypeScript, functions defined with async automatically return a Promise.
This means that we can use await inside the function, and when the function is called, it returns a Promise, allowing us to perform asynchronous operations.


A Promise is an object that represents a task that will be completed in the future. It has three states:

Pending → The operation is still in progress.
Resolved → The operation was successfully completed (the result can be accessed using .then()).
Rejected → The operation failed (errors can be caught using .catch()).
The async keyword ensures that the function returns a Promise.
A Promise represents the result of an asynchronous operation.
The handleAccess function processes HTTP requests asynchronously and returns an HttpEvent.

  */

   private async handleAccess(request:HttpRequest<any>,next:HttpHandler):Promise<HttpEvent<any>>
   {
    //only add access token for secured endpoints
    const secureEndpoints = ['http://localhost:8080/api/orders'];
    if(secureEndpoints.some(url=>request.urlWithParams.includes(url)))
    {
      // get access token
      const accessToken = this.oktaAuth.getAccessToken();

      //clone the request and add new header with access token
      request = request.clone({
        setHeaders:{
          Authhorization:'Bearer ' + accessToken
        }
      });


    }

    return await lastValueFrom(next.handle(request));


   }
}
