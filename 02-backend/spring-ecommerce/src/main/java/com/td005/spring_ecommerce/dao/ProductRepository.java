package com.td005.spring_ecommerce.dao;

import com.td005.spring_ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin(origins = "http://localhost:4200")
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {


    // will perform a search based on category id
    // DB : select * from product where category_id=?
    //localhost:8080/api/products/findByCategoryId?id=1
    
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

}
