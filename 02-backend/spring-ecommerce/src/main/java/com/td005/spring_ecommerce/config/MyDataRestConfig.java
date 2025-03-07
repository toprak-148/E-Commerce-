package com.td005.spring_ecommerce.config;

import com.td005.spring_ecommerce.entity.Country;
import com.td005.spring_ecommerce.entity.Product;
import com.td005.spring_ecommerce.entity.ProductCategory;
import com.td005.spring_ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // disable HTTP methods for  PUT, POST, DELETE and PATCH
        disabledHttpMethods(Product.class,config,theUnsupportedActions);
        disabledHttpMethods(ProductCategory.class,config,theUnsupportedActions);
        disabledHttpMethods(State.class,config,theUnsupportedActions);
        disabledHttpMethods(Country.class,config,theUnsupportedActions);


        //call an internal helper method
        exposeIds(config);

        // configure cors mapping
        cors.addMapping("/api/**").allowedOrigins("http://localhost:4200");


    }

    private void disabledHttpMethods(Class theClass, RepositoryRestConfiguration config , HttpMethod[] theUnsupportedActions)
    {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));

    }

    private void exposeIds(RepositoryRestConfiguration config)
    {
        //expose entity ids

        // -get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = this.entityManager.getMetamodel().getEntities();
        List<Class> entityClasses = new ArrayList<>();

        // - get the entity types for the entities
        for(EntityType tempEntityType : entities)
        {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // - expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);



    }
}