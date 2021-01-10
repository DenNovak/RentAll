package com.cookie.rentall.auth;

import javax.validation.constraints.NotBlank;

public class ChangePasswordRequest {
    @NotBlank
    private String password;

    private String uuid;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
