package com.phamquangha.demo.dto;

import java.util.List;

import lombok.*;

@Getter
@Setter
public class CategoryWithProductsDTO {
    private Long id;
    private String name;
    private String slug;
    private List<ProductDTO> products;
}
