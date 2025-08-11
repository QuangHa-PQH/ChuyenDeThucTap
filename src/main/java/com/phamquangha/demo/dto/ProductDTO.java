package com.phamquangha.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private double price;
    private int quantity;
    private String image;
    private Long categoryId;
    private Long brandId;
}
