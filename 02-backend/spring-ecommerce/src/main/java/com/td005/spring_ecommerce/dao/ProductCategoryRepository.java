package com.td005.spring_ecommerce.dao;

import com.td005.spring_ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;
 



/*RepositryRestResource : Bu anotasyon Spring Data REST'in bir parçası ve repository sınıflarını otomatik
   olarak RESTful web servislerine dönüştürmeye yarıyor.
  Yani repository tanımladığında, Spring bu anotasyon sayesinde otomatik olarak bir REST API oluşturuyor!
  */

@Repository
@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}

