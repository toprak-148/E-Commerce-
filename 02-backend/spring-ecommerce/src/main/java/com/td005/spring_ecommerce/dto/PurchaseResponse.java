package com.td005.spring_ecommerce.dto;


import lombok.Data;

// Bu class dbden gelen verileri geri front-end kısmına iletmek için kullanılır Json olarak bir java nesnesi(response)
@Data
public class PurchaseResponse {
    private final String orderTrackingNumber;


}
