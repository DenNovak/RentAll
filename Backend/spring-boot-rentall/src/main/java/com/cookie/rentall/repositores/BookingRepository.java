package com.cookie.rentall.repositores;

import com.cookie.rentall.entity.Booking;
import com.cookie.rentall.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends CrudRepository<Booking, Long> {

    @Query("select b from Booking b where b.product.userId = :userId and b.createDate is not null and b.bookingDate is null")
    Page<Booking> findOwnerReserved(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.product.userId = :userId and b.bookingDate is not null and b.clientReturnDate is null")
    Page<Booking> findOwnerBooked(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.product.userId = :userId and b.clientReturnDate is not null and b.returnDate is null")
    Page<Booking> findOwnerReadyToReturn(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.product.userId = :userId and b.returnDate is not null")
    Page<Booking> findOwnerReturned(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.userId = :userId and b.createDate is not null and b.bookingDate is null")
    Page<Booking> findConsumerReserved(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.userId = :userId and b.bookingDate is not null and b.clientReturnDate is null")
    Page<Booking> findConsumerBooked(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.userId = :userId and b.clientReturnDate is not null and b.returnDate is null")
    Page<Booking> findConsumerReadyToReturn(Long userId, Pageable pageable);

    @Query("select b from Booking b where b.userId = :userId and b.returnDate is not null")
    Page<Booking> findConsumerReturned(Long userId, Pageable pageable);
}

}
