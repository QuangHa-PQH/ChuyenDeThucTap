package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.OrderRequest;
import com.phamquangha.demo.entity.Order;
import com.phamquangha.demo.entity.OrderDetail;
import com.phamquangha.demo.entity.Product;
import com.phamquangha.demo.repository.OrderDetailRepository;
import com.phamquangha.demo.repository.OrderRepository;
import com.phamquangha.demo.repository.ProductRepository;
import com.phamquangha.demo.service.EmailService;
import com.phamquangha.demo.service.OrderService;

import jakarta.transaction.Transactional;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .customerEmail(request.getCustomerEmail())
                .deliveryAddress(request.getDeliveryAddress())
                .totalAmount(request.getTotalAmount())
                .note(request.getNote())
                .status("Đang xử lý")
                .build();
        orderRepository.save(order);

        StringBuilder emailContent = new StringBuilder();

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

        emailContent.append("<h3>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</h3>")
                .append("<p>Thông tin đơn hàng:</p>")
                .append("<ul>");

        for (OrderRequest.OrderItem item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

            if (product.getQuantity() < item.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho.");
            }

            // Trừ kho
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getUnitPrice() * item.getQuantity())
                    .build();
            orderDetailRepository.save(detail);

            // Thêm vào nội dung email
            emailContent.append("<li>")
                    .append(product.getName())
                    .append(" - Số lượng: ").append(item.getQuantity())
                    .append(" - Đơn giá: ").append(currencyFormat.format(item.getUnitPrice()))
                    .append("</li>");

        }

        emailContent.append("</ul>")
                .append("<p><strong>Tổng tiền:</strong> ").append(currencyFormat.format(order.getTotalAmount()))
                .append("</p>")
                .append("<p><strong>Địa chỉ giao hàng:</strong> ").append(order.getDeliveryAddress()).append("</p>")
                .append("<p><strong>Số điện thoại:</strong> ").append(order.getCustomerPhone()).append("</p>");

        if (order.getNote() != null && !order.getNote().isEmpty()) {
            emailContent.append("<p><strong>Ghi chú:</strong> ").append(order.getNote()).append("</p>");
        }

        try {
            emailService.sendOrderConfirmation(
                    order.getCustomerEmail(),
                    "Xác nhận đơn hàng",
                    emailContent.toString());
        } catch (Exception e) {
            System.out.println("Lỗi gửi email: " + e.getMessage());
            e.printStackTrace();
        }

        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders(); // dùng injected service
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));

        System.out.println("Trạng thái mới: " + status); // In log kiểm tra

        order.setStatus(status);
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));

        // Xóa các chi tiết đơn hàng trước (do ràng buộc FK)
        orderDetailRepository.deleteAllByOrder(order);

        // Sau đó xóa đơn hàng chính
        orderRepository.delete(order);

        return ResponseEntity.ok("Đã xóa đơn hàng thành công.");
    }
}
