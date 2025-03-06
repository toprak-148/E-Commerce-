import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

import { OktaAuthModule ,OktaCallbackComponent,OKTA_CONFIG, OktaAuthGuard} from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';

function sendToLoginPage(oktaAuth:OktaAuth,injector:Injector)
{
  //* Use injector to access any service avaialble within your application
  const router = injector.get(Router);

  //* redirect the user to your custom login page
  router.navigate(['/login']);

}
const routes: Routes = [
  {path:'members',component:MembersPageComponent , canActivate:[OktaAuthGuard] , data:{onAuthRequired:sendToLoginPage}},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path:'checkout' , component:CheckoutComponent},
  {path:'cart-details' , component:CartDetailComponent},
  {path:'products/:id',component:ProductDetailsComponent},
  {path:'search/:keyword',component:ProductListComponent},
  {path:'category/:id',component:ProductListComponent},
  {path:'category', component:ProductListComponent},
  {path:'products',component:ProductListComponent},
  {path:'',redirectTo:'/products',pathMatch:'full'},
  {path:'**',redirectTo:'/products',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
