package com.td005.spring_ecommerce.dao;

import com.td005.spring_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    // will perform a search based on category id
    // similar DB : select * from product where category_id=?
    //localhost:8080/api/products/findByCategoryId?id=1
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);


    // will perform a search on product:name
    // similar DB : select * from product p where p.name like concat('%',:name,'%')
    // localhost:8080/api/products/search/findByNameContaining?name=?
    Page<Product> findByNameContaining(@Param("name") String name , Pageable pageable);


}
