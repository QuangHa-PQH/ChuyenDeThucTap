package com.phamquangha.demo.service.impl;

import com.phamquangha.demo.entity.Order;
import com.phamquangha.demo.repository.OrderRepository;
import com.phamquangha.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Override
    public Order createOrder(Order order) {
        // created_at và orderDate đã tự động set trong @PrePersist rồi
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Long id, Order order) {
        Order existing = getOrderById(id);
        existing.setStatus(order.getStatus());
        existing.setTotalAmount(order.getTotalAmount());
        existing.setCustomerName(order.getCustomerName());
        existing.setCustomerPhone(order.getCustomerPhone());
        existing.setCustomerEmail(order.getCustomerEmail());
        existing.setDeliveryAddress(order.getDeliveryAddress());
        // updated_at tự động trong @PreUpdate
        return orderRepository.save(existing);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
