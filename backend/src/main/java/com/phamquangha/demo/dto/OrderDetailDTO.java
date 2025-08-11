package com.phamquangha.demo.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long id;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    private Long orderId;
    private Long productId;
}
