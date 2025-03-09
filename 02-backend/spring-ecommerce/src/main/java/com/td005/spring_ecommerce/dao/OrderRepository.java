package com.td005.spring_ecommerce.dao;

import com.td005.spring_ecommerce.entity.Order;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;

public interface OrderRepository extends JpaRepository<Order,Long> {

    Page<Order> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email , Pageable pageable);

}
