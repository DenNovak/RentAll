package com.cookie.rentall.controllers;

import com.cookie.rentall.services.ExternalProductService;
import com.cookie.rentall.views.ExternalProductView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
public class IntegrationController {

    @Autowired
    private ExternalProductService externalProductService;

    @GetMapping("api/externalProduct")
    public List<ExternalProductView> getExternalProduct() {
        return externalProductService.getExternalProductList();
    }
}


