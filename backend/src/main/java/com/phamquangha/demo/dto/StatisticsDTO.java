package com.phamquangha.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StatisticsDTO {
    private long totalOrders;
    private double totalRevenue;
    private long totalProductsSold;
}
