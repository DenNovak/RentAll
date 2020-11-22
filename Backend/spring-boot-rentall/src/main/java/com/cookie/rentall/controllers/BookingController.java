package com.cookie.rentall.controllers;

import com.cookie.rentall.auth.UserDetailsImpl;
import com.cookie.rentall.repositores.BookingRepository;
import com.cookie.rentall.views.BookingView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class BookingController {
    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("api/booking/{id}")
    public BookingView getBooking(@PathVariable("id") Long id) {
        return new BookingView(bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found")));
    }

    @GetMapping("api/booking/byOwner")
    public Page<BookingView> createdByUser(@RequestParam(name = "status") String status) {
        switch (status.toUpperCase()) {
            case "RESERVED":
                return bookingRepository.findOwnerReserved(getUserId(), Pageable.unpaged()).map(BookingView::new);
            case "BOOKED":
                return bookingRepository.findOwnerBooked(getUserId(), Pageable.unpaged()).map(BookingView::new);
            case "READY_TO_RETURN":
                return bookingRepository.findOwnerReadyToReturn(getUserId(), Pageable.unpaged()).map(BookingView::new);
            case "RETURNED":
                return bookingRepository.findOwnerReturned(getUserId(), Pageable.unpaged()).map(BookingView::new);
        }
        return Page.empty();
    }

    @GetMapping("api/booking/byConsumer")
    public Page<BookingView> gotByUser(@RequestParam(name = "status") String status) {
        switch (status.toUpperCase()) {
            case "RESERVED":
                return bookingRepository.findConsumerReserved(getUserId(), Pageable.unpaged()).map(BookingView::new);
            case "BOOKED":
                return bookingRepository.findConsumerBooked(getUserId(), Pageable.unpaged()).map(BookingView::new);
            case "READY_TO_RETURN":
                return bookingRepository.findConsumerReadyToReturn(getUserId(), Pageable.unpaged()).map(BookingView::new);
            case "RETURNED":
                return bookingRepository.findConsumerReturned(getUserId(), Pageable.unpaged()).map(BookingView::new);
        }
        return Page.empty();
    }

    private Long getUserId() {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        } catch (Exception e) {
            return null;
        }
    }
}
