package com.cookie.rentall.views;

import com.cookie.rentall.entity.Booking;

import java.math.BigDecimal;
import java.util.Date;

public class BookingView {
    private long id;
    private Long productId;
    private int pinCode;
    private Date createDate;
    private Date bookingDate;
    private Date returnDate;
    private long userId;
    private Boolean actual;
    private Date clientReturnDate;
    private Date expectedStart;
    private Date expectedEnd;
    private BigDecimal cost;

    public BookingView(Booking booking) {
        this.id = booking.getId();
        this.productId = booking.getProduct().getId();
        this.pinCode = booking.getPinCode();
        this.createDate = booking.getCreateDate();
        this.bookingDate = booking.getBookingDate();
        this.returnDate = booking.getReturnDate();
        this.userId = booking.getUserId();
        this.actual = booking.getActual();
        this.clientReturnDate = booking.getClientReturnDate();
        this.expectedStart = booking.getExpectedStart();
        this.expectedEnd = booking.getExpectedEnd();
        this.cost = booking.getCost();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getPinCode() {
        return pinCode;
    }

    public void setPinCode(int pinCode) {
        this.pinCode = pinCode;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(Date bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(Date returnDate) {
        this.returnDate = returnDate;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Boolean getActual() {
        return actual;
    }

    public void setActual(Boolean actual) {
        this.actual = actual;
    }

    public Date getClientReturnDate() {
        return clientReturnDate;
    }

    public void setClientReturnDate(Date clientReturnDate) {
        this.clientReturnDate = clientReturnDate;
    }

    public Date getExpectedStart() {
        return expectedStart;
    }

    public void setExpectedStart(Date expectedStart) {
        this.expectedStart = expectedStart;
    }

    public Date getExpectedEnd() {
        return expectedEnd;
    }

    public void setExpectedEnd(Date expectedEnd) {
        this.expectedEnd = expectedEnd;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }
}
