package com.cookie.rentall.services;

import com.cookie.rentall.views.ExternalProductView;

import java.util.List;

public interface ExternalProductService {
    /**
     * Gets external product list
     * @return external product list
     */
    List<ExternalProductView> getExternalProductList();
}
