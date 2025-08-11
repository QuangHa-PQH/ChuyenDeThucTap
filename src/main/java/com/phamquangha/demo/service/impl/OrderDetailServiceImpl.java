package com.phamquangha.demo.service.impl;

import com.phamquangha.demo.dto.OrderDetailDTO;
import com.phamquangha.demo.entity.OrderDetail;
import com.phamquangha.demo.repository.OrderDetailRepository;
import com.phamquangha.demo.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OrderDetailRepository repository;

    @Override
    public List<OrderDetail> getAll() {
        return repository.findAll();
    }

    @Override
    public List<OrderDetail> getByOrderId(Long orderId) {
        return repository.findByOrderId(orderId);
    }

    @Override
    public OrderDetail create(OrderDetail orderDetail) {
        return repository.save(orderDetail);
    }

    @Override
    public OrderDetail update(Long id, OrderDetail orderDetail) {
        orderDetail.setId(id);
        return repository.save(orderDetail);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // ✅ Thêm phương thức chuyển sang DTO
    public OrderDetailDTO convertToDTO(OrderDetail detail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setId(detail.getId());
        dto.setQuantity(detail.getQuantity());
        dto.setUnitPrice(detail.getUnitPrice());
        dto.setTotalPrice(detail.getTotalPrice());
        dto.setOrderId(detail.getOrder().getId());
        dto.setProductId(detail.getProduct().getId());
        return dto;
    }

    // ✅ Trả danh sách DTO theo orderId
    public List<OrderDetailDTO> getDTOsByOrderId(Long orderId) {
        return getByOrderId(orderId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
