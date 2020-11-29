package com.cookie.rentall.views;

import java.util.Date;

public class ProductUnavailableView {
    public ProductUnavailableView(Date start, Date end) {
        this.start = start;
        this.end = end;
    }

    public Date start;
    public Date end;
}