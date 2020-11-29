package com.cookie.rentall.controllers;
import com.cookie.rentall.auth.User;
import com.cookie.rentall.auth.UserDetailsImpl;
import com.cookie.rentall.auth.UserRepository;
import com.cookie.rentall.dao.ProductCategoryRepository;
import com.cookie.rentall.dao.ProductRepository;
import com.cookie.rentall.entity.Booking;
import com.cookie.rentall.entity.Product;
import com.cookie.rentall.entity.ProductCategory;
import com.cookie.rentall.product.ProductReserveRequest;
import com.cookie.rentall.product.ProductUpdateRequest;
import com.cookie.rentall.repositores.BookingRepository;
import com.cookie.rentall.views.ProductShortView;
import com.cookie.rentall.views.ProductStatusView;
import com.cookie.rentall.views.ProductUnavailableView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender emailSender;
    private void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@chriucha.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("user@gmail.com");//todo
        mailSender.setPassword("123");//todo
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        return mailSender;
    }
    @GetMapping("api/products/currentUser")
    public Long getCurrentUser() {
        return getUserId();
    }
    @GetMapping("api/products/view/{id}")
    public ProductUpdateRequest getProduct(@PathVariable("id") Long id) {
        return new ProductUpdateRequest(productRepository.getOne(id));
    }

    @GetMapping("api/products/{id}/unavailable")
    public List<ProductUnavailableView> getUnavailable(@PathVariable("id") Long id) {
        Date now = new Date();
        return productRepository.getOne(id).getBookings().stream().filter(b -> b.getExpectedEnd().after(now))
                .map(b -> new ProductUnavailableView(b.getExpectedStart(), b.getExpectedEnd())).collect(Collectors.toList());
    }

    @GetMapping("api/products/{id}/status")
    public ProductStatusView getProductStatus(@PathVariable("id") Long id) {
        Product p = productRepository.getOne(id);
        if (p.getBookings().stream().anyMatch(b -> b.getCreateDate() != null && b.getBookingDate() == null))
            return new ProductStatusView("RESERVED");
        if (p.getBookings().stream().anyMatch(b -> b.getBookingDate() != null && b.getReturnDate() == null && b.getClientReturnDate() == null))
            return new ProductStatusView("BOOKED");
        if (p.getBookings().stream().anyMatch(b -> b.getBookingDate() != null && b.getReturnDate() == null && b.getClientReturnDate() != null))
            return new ProductStatusView("RETURNED_BY_CONSUMER");
        return new ProductStatusView("FREE");
    }
    @GetMapping("api/products/{id}/consumer")
    public Long getProductConsumer(@PathVariable("id") Long id) {
        Product p = productRepository.getOne(id);
        Optional<Booking> booking = p.getBookings().stream().filter(b -> b.getCreateDate() != null && b.getBookingDate() == null || b.getBookingDate() != null && b.getReturnDate() == null).findFirst();
        if (booking.isPresent())
            return booking.get().getUserId();
        return 0L;
    }
    @GetMapping("api/products/available")
    public Page<ProductShortView> available() {
        return productRepository.findAll(Pageable.unpaged()).map(ProductShortView::new);
    }
    @GetMapping("api/products/createdByUser")
    public Page<ProductShortView> createdByUser(@RequestParam(name = "status") String status) {
        switch (status.toUpperCase()) {
            case "RESERVED":
                return productRepository.findUserReserved(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "BOOKED":
                return productRepository.findUserGot(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "RETURNED":
                return productRepository.findUserReturned(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
        }
        return Page.empty();
    }
    @GetMapping("api/products/gotByUser")
    public Page<ProductShortView> gotByUser(@RequestParam(name = "status") String status) {
        switch (status.toUpperCase()) {
            case "RESERVED":
                return productRepository.findCustomerReservations(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "BOOKED":
                return productRepository.findCustomerGot(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "RETURNED":
                return productRepository.findCustomerReturned(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
        }
        return Page.empty();
    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("api/products")
    public ProductUpdateRequest createProduct(@RequestBody ProductUpdateRequest request) {
        Product product = new Product();
        product.setActive(true);
        product.setCity(request.city);
        product.setDateCreated(new Date());
        product.setFirstName(request.firstName);
        product.setName(request.name);
        product.setDescription(request.description);
        product.setImageUrl(request.imageUrl);
        product.setPhoneNumber(request.phoneNumber);
        product.setUnitPrice(request.unitPrice);
        product.setUserId(getUserId());
        if (request.category != null) {
            ProductCategory productCategory = productCategoryRepository.findProductCategoryByCategoryName(request.category);
            if (productCategory != null) {
                product.setCategory(productCategory);
            }
        }
        productRepository.save(product);
        request.id = product.getId();
        return request;
    }
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/book")
    public Boolean book(@PathVariable("id") Long id, @RequestBody ProductReserveRequest request) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b ->
                isInInterval(request.expectedStart, b.getExpectedStart(), b.getExpectedEnd())
                        || isInInterval(request.expectedEnd, b.getExpectedStart(), b.getExpectedEnd())).findFirst();
        if (actualBooking.isPresent()) {
            return false;
        }
        Booking newBooking = new Booking();
        newBooking.setCreateDate(new Date());
        newBooking.setExpectedStart(request.expectedStart);
        newBooking.setExpectedEnd(request.expectedEnd);
        newBooking.setActual(true);
        newBooking.setUserId(getUserId());
        newBooking.setProduct(product);
        newBooking.setPinCode((int) (Math.random() * 100) + 1);
        bookingRepository.save(newBooking);
        return true;
    }
    private boolean isInInterval(Date date, Date begin, Date end) {
        if (begin == null || end == null) return false;
        return (date.after(begin) || date.equals(begin)) && (date.before(end) || date.equals(end));
    }
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/get")
    public Boolean giveProductToCustomer(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getBookingDate() == null && b.getCreateDate() != null && b.getReturnDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(product.getUserId()).equals(getUserId())) return false;
        actualBooking.get().setBookingDate(new Date());
        bookingRepository.save(actualBooking.get());
        //todo
        //sendSimpleMessage(userRepository.findById(actualBooking.get().getUserId()).map(User::getEmail).orElse(""), "Your booking accepted", product.getName() + " is successfully booked");
        return true;
    }
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/return")
    public Boolean returnProduct(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getBookingDate() != null && b.getCreateDate() != null && b.getClientReturnDate() != null && b.getReturnDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(product.getUserId()).equals(getUserId())) return false;
        actualBooking.get().setReturnDate(new Date());
        actualBooking.get().setActual(false);
        bookingRepository.save(actualBooking.get());
        return true;
    }
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/returnConsumer")
    public Boolean returnProductByConsumer(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getBookingDate() != null && b.getCreateDate() != null && b.getReturnDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(actualBooking.get().getUserId()).equals(getUserId())) return false;
        actualBooking.get().setClientReturnDate(new Date());
        bookingRepository.save(actualBooking.get());
        return true;
    }
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/cancel")
    public Boolean cancelReservation(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getCreateDate() != null && b.getBookingDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(actualBooking.get().getUserId()).equals(getUserId())) return false;
        List<Booking> newBookings = product.getBookings();
        newBookings.remove(actualBooking.get());
        product.setBookings(newBookings);
        productRepository.save(product);
        bookingRepository.delete(actualBooking.get());
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
 13  ...nd/spring-boot-rentall/src/main/java/com/cookie/rentall/views/ProductUnavailableView.java 
@@ -0,0 +1,13 @@
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
=======
package com.cookie.rentall.controllers;

import com.cookie.rentall.auth.User;
import com.cookie.rentall.auth.UserDetailsImpl;
import com.cookie.rentall.auth.UserRepository;
import com.cookie.rentall.dao.ProductCategoryRepository;
import com.cookie.rentall.dao.ProductRepository;
import com.cookie.rentall.entity.Booking;
import com.cookie.rentall.entity.Product;
import com.cookie.rentall.entity.ProductCategory;
import com.cookie.rentall.message.ResponseMessage;
import com.cookie.rentall.model.FileInfo;
import com.cookie.rentall.product.ProductUpdateRequest;
import com.cookie.rentall.repositores.BookingRepository;
import com.cookie.rentall.services.FilesStorageService;
import com.cookie.rentall.views.ProductShortView;
import com.cookie.rentall.views.ProductStatusView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    FilesStorageService storageService;

    private String imageUrl;

    private void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@chriucha.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        mailSender.setUsername("user@gmail.com");//todo
        mailSender.setPassword("123");//todo

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }

    @GetMapping("api/products/currentUser")
    public Long getCurrentUser() {
        return getUserId();
    }

    @GetMapping("api/products/view/{id}")
    public ProductUpdateRequest getProduct(@PathVariable("id") Long id) {
        return new ProductUpdateRequest(productRepository.getOne(id));
    }

    @GetMapping("api/products/{id}/status")
    public ProductStatusView getProductStatus(@PathVariable("id") Long id) {
        Product p = productRepository.getOne(id);
        if (p.getBookings().stream().anyMatch(b -> b.getCreateDate() != null && b.getBookingDate() == null))
            return new ProductStatusView("RESERVED");
        if (p.getBookings().stream().anyMatch(b -> b.getBookingDate() != null && b.getReturnDate() == null))
            return new ProductStatusView("BOOKED");
        return new ProductStatusView("FREE");
    }

    @GetMapping("api/products/{id}/consumer")
    public Long getProductConsumer(@PathVariable("id") Long id) {
        Product p = productRepository.getOne(id);
        Optional<Booking> booking = p.getBookings().stream().filter(b -> b.getCreateDate() != null && b.getBookingDate() == null || b.getBookingDate() != null && b.getReturnDate() == null).findFirst();
        if (booking.isPresent())
            return booking.get().getUserId();
        return 0L;
    }

    @GetMapping("api/products/available")
    public Page<ProductShortView> available() {
        return productRepository.findFree(Pageable.unpaged()).map(ProductShortView::new);
    }


    @GetMapping("api/products/createdByUser")
    public Page<ProductShortView> createdByUser(@RequestParam(name = "status") String status) {
        switch (status.toUpperCase()) {
            case "RESERVED":
                return productRepository.findUserReserved(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "BOOKED":
                return productRepository.findUserGot(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "RETURNED":
                return productRepository.findUserReturned(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
        }
        return Page.empty();
    }

    @GetMapping("api/products/gotByUser")
    public Page<ProductShortView> gotByUser(@RequestParam(name = "status") String status) {
        switch (status.toUpperCase()) {
            case "RESERVED":
                return productRepository.findCustomerReservations(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "BOOKED":
                return productRepository.findCustomerGot(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
            case "RETURNED":
                return productRepository.findCustomerReturned(getUserId(), Pageable.unpaged()).map(ProductShortView::new);
        }
        return Page.empty();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("api/products")
    public ProductUpdateRequest createProduct(@RequestBody ProductUpdateRequest request) {
        Product product = new Product();
        product.setActive(true);
        product.setCity(request.city);
        product.setDateCreated(new Date());
        product.setFirstName(request.firstName);
        product.setName(request.name);
        product.setDescription(request.description);
        product.setImageUrl(request.imageUrl);
        product.setPhoneNumber(request.phoneNumber);
        product.setUnitPrice(request.unitPrice);
        product.setUserId(getUserId());
        if(this.imageUrl != null) {
            product.setImageUrl(this.imageUrl);
        }

        if (request.category != null) {
            ProductCategory productCategory = productCategoryRepository.findProductCategoryByCategoryName(request.category);
            if (productCategory != null) {
                product.setCategory(productCategory);
            }
        }
        productRepository.save(product);
        request.id = product.getId();
        this.imageUrl = null;

        return request;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/book")
    public Boolean book(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getBookingDate() == null || b.getCreateDate() == null || b.getReturnDate() == null).findFirst();
        if (actualBooking.isPresent()) {
            return false;
        }
        Booking newBooking = new Booking();
        newBooking.setCreateDate(new Date());
        newBooking.setActual(true);
        newBooking.setUserId(getUserId());
        newBooking.setProduct(product);
        newBooking.setPinCode((int) (Math.random() * 100) + 1);
        bookingRepository.save(newBooking);
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/get")
    public Boolean giveProductToCustomer(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getBookingDate() == null && b.getCreateDate() != null && b.getReturnDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(product.getUserId()).equals(getUserId())) return false;
        actualBooking.get().setBookingDate(new Date());
        bookingRepository.save(actualBooking.get());
        //todo
        //sendSimpleMessage(userRepository.findById(actualBooking.get().getUserId()).map(User::getEmail).orElse(""), "Your booking accepted", product.getName() + " is successfully booked");
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/return")
    public Boolean returnProduct(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getBookingDate() != null && b.getCreateDate() != null && b.getReturnDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(product.getUserId()).equals(getUserId())) return false;
        actualBooking.get().setReturnDate(new Date());
        actualBooking.get().setActual(false);
        bookingRepository.save(actualBooking.get());
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("api/products/{id}/cancel")
    public Boolean cancelReservation(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        Optional<Booking> actualBooking = product.getBookings().stream().filter(b -> b.getCreateDate() != null && b.getBookingDate() == null).findFirst();
        if (!actualBooking.isPresent()) {
            return false;
        }
        if (!new Long(actualBooking.get().getUserId()).equals(getUserId())) return false;
        List<Booking> newBookings = product.getBookings();
        newBookings.remove(actualBooking.get());
        product.setBookings(newBookings);
        productRepository.save(product);
        bookingRepository.delete(actualBooking.get());
        return true;
    }

    private Long getUserId() {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        } catch (Exception e) {
            return null;
        }
    }


    @PostMapping("api/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file) {
        String message = "";

        try {

            storageService.save(file);
            message = "Upload the file successfully. ";
            this.imageUrl = "http://localhost:8080/api/files/" + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message="Could not upload the file: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }


    @GetMapping("api/files/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.load(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("api/files")
    public ResponseEntity<List<FileInfo>> getListFiles() {
        List<FileInfo> fileInfos = storageService.loadAll().map(path -> {
            String filename = path.getFileName().toString();
            String url = MvcUriComponentsBuilder
                    .fromMethodName(ProductController.class, "getFile", path.getFileName().toString()).build().toString();
            return new FileInfo(filename, url);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
    }
}

