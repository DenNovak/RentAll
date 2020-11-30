package com.cookie.rentall.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "booking")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "pin_code")
    private int pinCode;

    @Column(name = "create_date")
    @CreationTimestamp
    private Date createDate;

    @Column(name = "booking_date")
    private Date bookingDate;

    @Column(name = "return_date")
    private Date returnDate;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "actual")
    private Boolean actual;

    @Column(name = "client_return_date")
    private Date clientReturnDate;

    @Column(name="expected_start")
    private Date expectedStart;

    @Column(name="expected_end")
    private Date expectedEnd;

    @Column(name = "cost")
    private BigDecimal cost;

    public long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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
