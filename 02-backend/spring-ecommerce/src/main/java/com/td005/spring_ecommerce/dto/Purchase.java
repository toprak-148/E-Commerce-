package com.td005.spring_ecommerce.dto;

import com.td005.spring_ecommerce.entity.Address;
import com.td005.spring_ecommerce.entity.Customer;
import com.td005.spring_ecommerce.entity.Order;
import com.td005.spring_ecommerce.entity.OrderItem;
import lombok.Data;


import java.util.Set;

@Data

public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;



}
