package com.cookie.rentall.controllers;


import com.cookie.rentall.H2JpaConfig;
import com.cookie.rentall.SpringBootRentallApplication;
import com.cookie.rentall.dao.ProductRepository;
import com.cookie.rentall.entity.Product;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {SpringBootRentallApplication.class, H2JpaConfig.class})
@AutoConfigureMockMvc
@TestPropertySource(
        locations = "classpath:application-integrationtest.properties")
public class ProductControllerIntegrationTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ProductRepository repository;

    @Test
    public void testAvailable() throws Exception {
        createTestProduct("Product");

        mvc.perform(get("/api/products/available")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].name", org.hamcrest.Matchers.is("Product")))
                .andExpect(jsonPath("$.content[0].city", org.hamcrest.Matchers.is("Warsaw")));
    }


    private void createTestProduct(String name) {
        Product product = new Product();
        product.setName(name);
        product.setCity("Warsaw");
        repository.save(product);
    }


}