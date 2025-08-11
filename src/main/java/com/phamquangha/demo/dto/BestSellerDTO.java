package com.phamquangha.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BestSellerDTO {
    private String productName;
    private Long productId;
    private int totalSold;
}
