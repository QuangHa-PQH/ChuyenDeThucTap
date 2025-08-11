package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.BestSellerDTO;
import com.phamquangha.demo.dto.MonthlySalesDTO;
import com.phamquangha.demo.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:3000") // CORS nếu frontend React
public class StatisticsController {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @GetMapping("/revenue")
    public Double getYearlyRevenue(@RequestParam(defaultValue = "0") int year) {
        int targetYear = (year == 0) ? Year.now().getValue() : year;
        return orderDetailRepository.getTotalRevenueByYear(targetYear);
    }

    @GetMapping("/monthly-sales")
    public List<MonthlySalesDTO> getMonthlySales(@RequestParam(defaultValue = "0") int year) {
        int targetYear = (year == 0) ? Year.now().getValue() : year;
        List<Object[]> results = orderDetailRepository.getMonthlySales(targetYear);
        return results.stream()
                .map(obj -> new MonthlySalesDTO((int) obj[0], (double) obj[1]))
                .collect(Collectors.toList());
    }

    @GetMapping("/best-sellers")
    public List<BestSellerDTO> getBestSellers() {
        List<Object[]> results = orderDetailRepository.getBestSellingProducts();
        return results.stream()
                .map(obj -> new BestSellerDTO((String) obj[1], (Long) obj[0], ((Long) obj[2]).intValue()))
                .collect(Collectors.toList());
    }
}
