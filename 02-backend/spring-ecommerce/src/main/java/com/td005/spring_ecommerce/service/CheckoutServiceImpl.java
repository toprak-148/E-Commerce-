package com.td005.spring_ecommerce.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.td005.spring_ecommerce.dao.CustomerRepository;
import com.td005.spring_ecommerce.dto.PaymentInfo;
import com.td005.spring_ecommerce.dto.Purchase;
import com.td005.spring_ecommerce.dto.PurchaseResponse;
import com.td005.spring_ecommerce.entity.Customer;
import com.td005.spring_ecommerce.entity.Order;
import com.td005.spring_ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;



    // tek bir kurucu olduğu için Autowired anotasyonuna gerek yok.
    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey)
    {
        this.customerRepository = customerRepository;

        //initialize Stripe API with secret key
        Stripe.apiKey = secretKey;

    }





    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase)
    {
        // retrieve the order info from dto
        Order order = purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);


        // populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));


        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        String theEmail = customer.getEmail();
        // Musteri eger dbde mevcut ise müsteri havuzunu kullanarak  mail adresini mail yolu ile bul
        Customer customerFromDb = customerRepository.findByEmail(theEmail);

        if(customerFromDb != null) {
            // musteri bulundu. bu musteriye gore degerlendir
            customer = customerFromDb;
        }



        customer.add(order);

        // save to database
        customerRepository.save(customer);


        //return a response

        return new PurchaseResponse(orderTrackingNumber);

    }


    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException
    {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String,Object> params = new HashMap<>();
        params.put("amount",paymentInfo.getAmount());
        params.put("currency",paymentInfo.getCurreny());
        params.put("payment_method_types",paymentMethodTypes);
        params.put("description","E-commerce purchase");
        params.put("receipt email",paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);


    }

    // temelde benzersiz bir kimlik oluşturmak istiyoruz : UUID
    private String generateOrderTrackingNumber()
    {
        // generate a random UUID number ( UUID version-4)
        return UUID.randomUUID().toString();
    }


}
