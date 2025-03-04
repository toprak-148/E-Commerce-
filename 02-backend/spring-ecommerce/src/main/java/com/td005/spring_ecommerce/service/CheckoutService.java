package com.td005.spring_ecommerce.service;

import com.td005.spring_ecommerce.dto.Purchase;
import com.td005.spring_ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    // ödeme bu metod sayesinde gerçekleşecektir.Yani siparişi burada ver diyeceğiz.
    // Satın alma DTO'sunu devredeceğiz.
    // Daha sonra satın alma yanıtını döneceğiz.
    PurchaseResponse placeOrder(Purchase purchase);

}
