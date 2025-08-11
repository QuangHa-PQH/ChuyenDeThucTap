package com.phamquangha.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlySalesDTO {
    private int month;
    private double totalSales;
}
