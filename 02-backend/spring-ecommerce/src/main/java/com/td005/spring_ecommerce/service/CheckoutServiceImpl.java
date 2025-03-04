package com.td005.spring_ecommerce.service;

import com.td005.spring_ecommerce.dao.CustomerRepository;
import com.td005.spring_ecommerce.dto.Purchase;
import com.td005.spring_ecommerce.dto.PurchaseResponse;
import com.td005.spring_ecommerce.entity.Customer;
import com.td005.spring_ecommerce.entity.Order;
import com.td005.spring_ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;


    // tek bir kurucu olduğu için Autowired anotasyonuna gerek yok.
    public CheckoutServiceImpl(CustomerRepository customerRepository)
    {
        this.customerRepository = customerRepository;
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
        customer.add(order);

        // save to database
        customerRepository.save(customer);


        //return a response

        return new PurchaseResponse(orderTrackingNumber);

    }

    // temelde benzersiz bir kimlik oluşturmak istiyoruz : UUID
    private String generateOrderTrackingNumber()
    {
        // generate a random UUID number ( UUID version-4)
        return UUID.randomUUID().toString();
    }

}
