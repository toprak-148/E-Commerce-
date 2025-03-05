package com.td005.spring_ecommerce.controller;

import com.td005.spring_ecommerce.dto.Purchase;
import com.td005.spring_ecommerce.dto.PurchaseResponse;
import com.td005.spring_ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService)
    {
        this.checkoutService = checkoutService;
    }


    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase)
    {
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }
}
