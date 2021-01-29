package com.cookie.rentall.auth;

import com.cookie.rentall.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordResetRepository passwordResetRepository;

    @Value("${site.url}")
    private String siteUri;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/getChangePasswordLink")
    public ResponseEntity<?> generatePasswordChangeLink(@Valid @RequestBody GenerateChangePasswordLinkRequest request) {
        String id = UUID.randomUUID().toString();
        PasswordReset passwordReset = new PasswordReset();
        passwordReset.setUuid(id);
        passwordReset.setUserId(userRepository.findByEmail(request.getEmail()).map(User::getId).orElseThrow(() -> new RuntimeException("User Not found")));
        passwordReset.setCreated(LocalDateTime.now());
        passwordResetRepository.save(passwordReset);
        try {
            emailService.sendSimpleMessage(request.getEmail(), "Password recovery", "Link to password change: <a>" + siteUri + "/resetPassword?id=" + id + "</a>");
        } catch (MessagingException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Failed to send email" + e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Password change link generated!"));
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> generatePasswordChangeLink(@RequestBody ChangePasswordRequest request) {
        User user = null;
        Long userId = getUserId();
        if (userId == null) {
            PasswordReset passwordReset = passwordResetRepository.findPasswordResetByUuid(request.getUuid()).orElse(null);
            if (passwordReset == null)
                return ResponseEntity.badRequest().body(new MessageResponse("Wrong uuid"));
            user = userRepository.getOne(passwordReset.getUserId());
        } else {
            user = userRepository.getOne(userId);
        }
        user.setPassword(encoder.encode(request.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
    }

    private Long getUserId() {
        try {
            return ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        } catch (Exception e) {
            return null;
        }
    }
}
