package com.cookie.rentall.controllers;

import com.cookie.rentall.auth.UserDetailsImpl;
import com.cookie.rentall.entity.Booking;
import com.cookie.rentall.repositores.BookingRepository;
import com.cookie.rentall.views.BookingView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

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

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/booking/{id}/confirmReservation")
    public Boolean giveProductToCustomer(@PathVariable("id") Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (!booking.isPresent()) {
            return false;
        }
        if (!new Long(booking.get().getProduct().getUserId()).equals(getUserId())) return false;
        booking.get().setBookingDate(new Date());
        bookingRepository.save(booking.get());
        //todo
        //sendSimpleMessage(userRepository.findById(actualBooking.get().getUserId()).map(User::getEmail).orElse(""), "Your booking accepted", product.getName() + " is successfully booked");
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/booking/{id}/return")
    public Boolean returnProductByConsumer(@PathVariable("id") Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (!booking.isPresent()) {
            return false;
        }
        if (!new Long(booking.get().getUserId()).equals(getUserId())) return false;
        booking.get().setClientReturnDate(new Date());
        bookingRepository.save(booking.get());
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/booking/{id}/confirmReturn")
    public Boolean returnProduct(@PathVariable("id") Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (!booking.isPresent()) {
            return false;
        }
        if (!new Long(booking.get().getProduct().getUserId()).equals(getUserId())) return false;
        booking.get().setReturnDate(new Date());
        booking.get().setActual(false);
        bookingRepository.save(booking.get());
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/booking/{id}/cancel")
    public Boolean cancelReservation(@PathVariable("id") Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (!booking.isPresent()) {
            return false;
        }
        bookingRepository.delete(booking.get());
        return true;
    }


    private Long getUserId() {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        } catch (Exception e) {
            return null;
        }
    }
}
