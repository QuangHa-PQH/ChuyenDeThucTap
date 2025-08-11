package com.phamquangha.demo.service;

import com.phamquangha.demo.entity.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetail> getAll();

    List<OrderDetail> getByOrderId(Long orderId);

    OrderDetail create(OrderDetail orderDetail);

    OrderDetail update(Long id, OrderDetail orderDetail);

    void delete(Long id);
}
