package com.phamquangha.demo.dto;

import java.util.List;

public class BrandDTO {
    private Long id;
    private String name;
    private String slug;
    private String image; // Hình ảnh của thương hiệu
    private List<Long> productIds; // Danh sách ID sản phẩm

    // Getters and Setters
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

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image; // Thêm setter cho image của thương hiệu
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }
}
