package com.cookie.rentall.controllers;

import com.cookie.rentall.repositores.BookingRepository;
import com.cookie.rentall.views.BookingView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class BookingController {
    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("api/booking/{id}")
    public BookingView getBooking(@PathVariable("id") Long id) {
        return new BookingView(bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found")));
    }
}
