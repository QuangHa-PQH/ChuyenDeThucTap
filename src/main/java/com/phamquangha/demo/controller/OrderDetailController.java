package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.OrderDetailDTO;
import com.phamquangha.demo.entity.OrderDetail;
import com.phamquangha.demo.service.OrderDetailService;
import com.phamquangha.demo.service.impl.OrderDetailServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
public class OrderDetailController {

    private final OrderDetailService service;
    private final OrderDetailServiceImpl serviceImpl;

    @GetMapping
    public List<OrderDetail> getAll() {
        return service.getAll();
    }

    @GetMapping("/order/{orderId}")
    public List<OrderDetailDTO> getByOrder(@PathVariable Long orderId) {
        return serviceImpl.getDTOsByOrderId(orderId);
    }

    @PostMapping
    public OrderDetail create(@RequestBody OrderDetail detail) {
        return service.create(detail);
    }

    @PutMapping("/{id}")
    public OrderDetail update(@PathVariable Long id, @RequestBody OrderDetail detail) {
        return service.update(id, detail);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
