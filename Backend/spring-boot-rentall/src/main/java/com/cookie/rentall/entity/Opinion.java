package com.cookie.rentall.entity;

import com.cookie.rentall.auth.User;
import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "opinion")
@Data
public class Opinion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User users;

    @Column(name = "author_id", nullable = false)
    private Long authorId;

    @Column(name = "content")
    private String content;

    @Column(name = "rating")
    private Integer rating;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public User getUser() {
        return users;
    }

    public void setUser(User user) {
        this.users = user;
    }

    public Long getAuthor() {
        return authorId;
    }

    public void setAuthor(Long author) {
        this.authorId = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
