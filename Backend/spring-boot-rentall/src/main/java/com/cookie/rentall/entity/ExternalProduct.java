package com.cookie.rentall.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name="external_product")
@Data
public class ExternalProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column
    private String name;

    @Column
    private String category;

    @Column
    private String productID;

    @Column
    private String pojemnoscSilnika;

    @Column
    private String markaSilnika;

    @Column
    private String szerokoscKoszenia;

    @Column
    private String regulacjaWysokosciKoszenia;

    @Column
    private String pojemnoscKosza;

    @Column
    private String photoLink;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProductID() {
        return productID;
    }

    public void setProductID(String productID) {
        this.productID = productID;
    }

    public String getPojemnoscSilnika() {
        return pojemnoscSilnika;
    }

    public void setPojemnoscSilnika(String pojemnoscSilnika) {
        this.pojemnoscSilnika = pojemnoscSilnika;
    }

    public String getMarkaSilnika() {
        return markaSilnika;
    }

    public void setMarkaSilnika(String markaSilnika) {
        this.markaSilnika = markaSilnika;
    }

    public String getSzerokoscKoszenia() {
        return szerokoscKoszenia;
    }

    public void setSzerokoscKoszenia(String szerokoscKoszenia) {
        this.szerokoscKoszenia = szerokoscKoszenia;
    }

    public String getRegulacjaWysokosciKoszenia() {
        return regulacjaWysokosciKoszenia;
    }

    public void setRegulacjaWysokosciKoszenia(String regulacjaWysokosciKoszenia) {
        this.regulacjaWysokosciKoszenia = regulacjaWysokosciKoszenia;
    }

    public String getPojemnoscKosza() {
        return pojemnoscKosza;
    }

    public void setPojemnoscKosza(String pojemnoscKosza) {
        this.pojemnoscKosza = pojemnoscKosza;
    }

    public String getPhotoLink() {
        return photoLink;
    }

    public void setPhotoLink(String photoLink) {
        this.photoLink = photoLink;
    }
}
