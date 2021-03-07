package com.cookie.rentall.controllers;

import com.cookie.rentall.auth.UserDetailsImpl;
import com.cookie.rentall.auth.UserRepository;
import com.cookie.rentall.dao.ProductCategoryRepository;
import com.cookie.rentall.dao.ProductRepository;
import com.cookie.rentall.entity.Booking;
import com.cookie.rentall.entity.Image;
import com.cookie.rentall.entity.Product;
import com.cookie.rentall.entity.ProductCategory;
import com.cookie.rentall.product.ProductReserveRequest;
import com.cookie.rentall.product.ProductUpdateRequest;
import com.cookie.rentall.repositores.BookingRepository;
import com.cookie.rentall.repositores.ImageRepository;
import com.cookie.rentall.requests.ImageSaveRequest;
import com.cookie.rentall.services.StorageService;
import com.cookie.rentall.views.ProductShortView;
import com.cookie.rentall.views.ProductStatusView;
import com.cookie.rentall.views.ProductUnavailableView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;
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
    private ImageRepository imageRepository;

    @Autowired
    private StorageService storageService;

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
        return productRepository.getOne(id).getBookings().stream().filter(b -> b.getExpectedEnd() != null && b.getExpectedEnd().after(now))
                .map(b -> new ProductUnavailableView(b.getExpectedStart(), b.getExpectedEnd())).collect(Collectors.toList());
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("api/products/{id}")
    public boolean deleteProduct(@PathVariable("id") Long id) {
        Product product = productRepository.getOne(id);
        if (product == null || product.getUserId() != getCurrentUser()) {
            return false;
        }
        product.setDeleted(true);
        productRepository.save(product);
        return true;
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
    public Page<ProductShortView> available(@RequestParam(name = "filter", defaultValue = "") String filter,
                                            @RequestParam(name = "city", defaultValue = "") String city,
                                            @RequestParam(name = "category", defaultValue = "") String category) {
        if (StringUtils.isEmpty(category)) {
            if (StringUtils.isEmpty(city)) {
                return productRepository.findAllNotDeletedWithoutCategoryAndCity(Pageable.unpaged(), filter).map(ProductShortView::new);
            } else {
                return productRepository.findAllNotDeletedWithoutCategory(Pageable.unpaged(), filter, city).map(ProductShortView::new);
            }
        } else {
            return productRepository.findAllNotDeleted(Pageable.unpaged(), filter, city, category).map(ProductShortView::new);
        }
    }

    @GetMapping("api/products/owners")
    public Page<ProductShortView> owners() {
        return productRepository.findAllOwners(getCurrentUser(), Pageable.unpaged()).map(ProductShortView::new);
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
        product.setUserDescription(request.userDescription);
        product.setCondition(request.condition);
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

    @GetMapping("api/products/image/{id}")
    public ResponseEntity<Resource> getImage(@PathVariable("id") Long id) {
        Optional<Image> image = imageRepository.findById(id);
        if (image.isPresent()) {
            Resource file = storageService.loadAsResource(image.get().getFilename());
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + file.getFilename() + "\"").body(file);
        }
        return null;
    }

    @GetMapping("api/products/{id}/image/count")
    public Integer getImageCount(@PathVariable("id") Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(value -> value.getImages().size()).orElse(0);
    }

    @GetMapping("api/products/{id}/image/ids")
    public List<Long> getImageIds(@PathVariable("id") Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(value -> value.getImages().stream().map(Image::getId).collect(Collectors.toList())).orElse(Collections.emptyList());
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("api/products/{id}/image")
    public Boolean uploadImage(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        Optional<Product> product = productRepository.findById(id);
        if (!product.isPresent() || product.get().getUserId() != getCurrentUser())
            return false;
        String storedName = UUID.randomUUID().toString() + file.getOriginalFilename();
        storageService.store(file, storedName);
        Image image = new Image();
        image.setFilename(storedName);
        image.setUserId(getCurrentUser());
        imageRepository.save(image);
        List<Image> images = new ArrayList<>(product.get().getImages());
        images.add(image);
        product.get().setImages(images);
        productRepository.save(product.get());
        return true;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("api/products/{id}/imageFromUrl")
    public Boolean uploadImageFromUrl(@PathVariable("id") Long id, @RequestBody ImageSaveRequest request) {
        Optional<Product> product = productRepository.findById(id);
        if (!product.isPresent() || product.get().getUserId() != getCurrentUser())
            return false;
        String storedName = UUID.randomUUID().toString();

        try {
            URL url = new URL(request.getUrl());
            java.net.URLConnection cconnection = url.openConnection();
            cconnection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[1024];
            while ((nRead = cconnection.getInputStream().read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            buffer.flush();
            byte[] byteArray = buffer.toByteArray();
            storageService.store(byteArray, storedName);
            Image image = new Image();
            image.setFilename(storedName);
            image.setUserId(getCurrentUser());
            imageRepository.save(image);
            List<Image> images = new ArrayList<>(product.get().getImages());
            images.add(image);
            product.get().setImages(images);
            productRepository.save(product.get());
            return true;
        } catch (IOException e) {
            return false;
        }
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
        Date from = cutDate(request.expectedStart);
        Date to = cutDate(request.expectedEnd);
        newBooking.setExpectedStart(from);
        newBooking.setExpectedEnd(to);
        newBooking.setCost(product.getUnitPrice().multiply(BigDecimal.valueOf((to.getTime() - from.getTime()) / (1000 * 3600 * 24) + 1)));
        newBooking.setActual(true);
        newBooking.setUserId(getUserId());
        newBooking.setProduct(product);
        newBooking.setPinCode((int) (Math.random() * 100) + 1);
        bookingRepository.save(newBooking);
        return true;
    }

    private Date cutDate(Date date) {
        LocalDate localDate = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate().atStartOfDay().toLocalDate();
        return Date.from(localDate.atStartOfDay().atZone(ZoneOffset.UTC).toInstant());
    }

    private boolean isInInterval(Date date, Date begin, Date end) {
        if (begin == null || end == null) return false;
        return (date.after(begin) || date.equals(begin)) && (date.before(end) || date.equals(end));
    }

    private Long getUserId() {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        } catch (Exception e) {
            return null;
        }
    }

    private RestTemplate createImageRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        StringHttpMessageConverter converter = new StringHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG));
        messageConverters.add(converter);
        restTemplate.setMessageConverters(messageConverters);
        return restTemplate;
    }

    private HttpEntity<String> createStringHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG));
        headers.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");
        return new HttpEntity<>("parameters", headers);
    }
}
