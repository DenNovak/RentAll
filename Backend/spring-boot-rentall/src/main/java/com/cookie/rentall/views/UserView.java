package com.cookie.rentall.views;

import com.cookie.rentall.auth.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserView {
    private String email;
    private String firstName;
    private String lastName;
    private String description;
    private List<OpinionView> opinions;

    public UserView(User user) {
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.description = user.getDescription();
        this.opinions = user.getOpinions().stream().map(OpinionView::new).collect(Collectors.toList());
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<OpinionView> getOpinions() {
        return opinions;
    }

    public void setOpinions(List<OpinionView> opinions) {
        this.opinions = opinions;
    }
}
