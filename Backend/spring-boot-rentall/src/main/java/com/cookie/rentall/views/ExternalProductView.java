package com.cookie.rentall.views;

public class ExternalProductView {
    public ExternalProductView() {
        name = "ExampleProduct";
    }

    private String name;
    private String category;
    private String productID;
    private String pojemnoscSilnika;
    private String markaSilnika;
    private String szerokoscKoszenia;
    private String regulacjaWysokosciKoszenia;
    private String pojemnoscKosza;
    private String photoLink;

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
