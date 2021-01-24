package com.cookie.rentall.repositores;

import com.cookie.rentall.entity.ExternalProduct;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ExternalProductRepository extends CrudRepository<ExternalProduct, Long> {
    Optional<ExternalProduct> findByProductID(String productId);
}
