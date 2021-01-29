package com.cookie.rentall.views;

import com.cookie.rentall.entity.Opinion;

public class OpinionView {
    private Long authorId;
    private String content;
    private Integer rating;

    public OpinionView(Opinion opinion) {
        this.authorId = opinion.getAuthor();
        this.content = opinion.getContent();
        this.rating = opinion.getRating();
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
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
