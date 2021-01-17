package com.cookie.rentall.auth;

import javax.validation.constraints.NotBlank;

public class GenerateChangePasswordLinkRequest {
    @NotBlank
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}