package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.OrderRequest;
import com.phamquangha.demo.service.VNPayService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;

    @PostMapping("/vnpay")
    public ResponseEntity<String> createVnpayPayment(@RequestBody OrderRequest orderRequest,
            HttpServletRequest request) {
        String vnpayUrl = vnPayService.createVnpayPayment(orderRequest, request);
        return ResponseEntity.ok(vnpayUrl);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<String> vnpayReturn(@RequestParam Map<String, String> params) {
        boolean isSuccess = vnPayService.handleVnpayReturn(params);
        if (isSuccess) {
            return ResponseEntity.ok("Thanh toán thành công!");
        } else {
            return ResponseEntity.status(400).body("Thanh toán thất bại!");
        }
    }
}
