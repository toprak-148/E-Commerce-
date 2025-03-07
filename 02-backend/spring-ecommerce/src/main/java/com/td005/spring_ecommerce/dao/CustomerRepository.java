package com.td005.spring_ecommerce.dao;

import com.td005.spring_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


//customer kullanılmasının nedeni, müşteri bir sipariş koleksiyonu vardır.Yani bir satın alma gerçekleştiğinde müşteriyi yakalayacağız,
// uygun eşleşmede gerçek müşteriyi bulacağız.
public interface CustomerRepository extends JpaRepository<Customer,Long> {

    // select * from Customer c where c.email = thEmail
    Customer findByEmail(String theEmail);



}
