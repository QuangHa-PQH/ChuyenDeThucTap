package com.phamquangha.demo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private List<Long> productIds;
}
