package com.cookie.rentall.controllers;
import com.cookie.rentall.auth.User;
import com.cookie.rentall.auth.UserDetailsImpl;
import com.cookie.rentall.auth.UserRepository;
import com.cookie.rentall.requests.UserUpdateRequest;
import com.cookie.rentall.views.UserView;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
@CrossOrigin
@RestController
public class UserController {
    private final UserRepository userRepository;
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("api/user/{id}")
    public UserView getUser(@PathVariable("id") Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(UserView::new).orElse(null);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("api/user/{id}")
    public UserView cancelReservation(@PathVariable("id") Long id, @RequestBody UserUpdateRequest request) {
        Optional<User> user = userRepository.findById(id);
        if (!user.isPresent() || !user.get().getId().equals(getUserId())) {
            return null;
        }
        if (request.getFirstName() != null) user.get().setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.get().setLastName(request.getLastName());
        if (request.getEmail() != null) user.get().setEmail(request.getEmail());
        if (request.getDescription() != null) user.get().setDescription(request.getDescription());
        userRepository.save(user.get());
        return new UserView(user.get());
    }
    private Long getUserId() {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        } catch (Exception e) {
            return null;
        }
    }
}