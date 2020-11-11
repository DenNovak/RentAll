package com.cookie.rentall.product;

import com.cookie.rentall.entity.Booking;
import com.cookie.rentall.entity.Product;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class ProductUpdateRequest {

    public Long id;

    public String category;

    public List<Booking> booking;

    public String name;

    public String firstName;

    public String phoneNumber;

    public String description;

    public BigDecimal unitPrice;

    public String imageUrl;

    public boolean active;

    public Date dateCreated;

    public Date lastUpdated;

    public String city;

    public ProductUpdateRequest() {}

    public ProductUpdateRequest(Product product) {
        this.active = product.isActive();
        this.category = product.getCategory().getCategoryName();
        this.city = product.getCity();
        this.dateCreated = product.getDateCreated();
        this.description = product.getDescription();
        this.id = product.getId();
        this.firstName = product.getFirstName();
        this.imageUrl = product.getImageUrl();
        this.name = product.getName();
        this.lastUpdated = product.getLastUpdated();
        this.phoneNumber = product.getPhoneNumber();
        this.unitPrice = product.getUnitPrice();
    }
}
