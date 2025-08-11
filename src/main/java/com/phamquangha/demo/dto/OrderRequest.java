package com.phamquangha.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String deliveryAddress;
    private Double totalAmount;
    private String note;

    private List<OrderItem> items;

    @Data
    public static class OrderItem {
        private Long productId;
        private String productName;
        private int quantity;
        private Double unitPrice;
    }
}
