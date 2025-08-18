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
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

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
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        // 1. Tạo đơn hàng
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

        // 2. Lấy danh sách productId trong đơn hàng
        List<Long> productIds = request.getItems()
                .stream().map(OrderRequest.OrderItem::getProductId).toList();

        // 3. Lấy tất cả sản phẩm trong 1 query
        List<Product> products = productRepository.findAllById(productIds);
        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        // 4. Chuẩn bị danh sách OrderDetail + cập nhật số lượng tồn kho
        List<OrderDetail> orderDetails = new ArrayList<>();
        StringBuilder emailContent = new StringBuilder();
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

        emailContent.append("<h3>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</h3>")
                .append("<p>Thông tin đơn hàng:</p>")
                .append("<ul>");

        for (OrderRequest.OrderItem item : request.getItems()) {
            Product product = productMap.get(item.getProductId());
            if (product == null) {
                throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + item.getProductId());
            }

            // Kiểm tra tồn kho
            if (product.getQuantity() < item.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho.");
            }

            // Trừ kho
            product.setQuantity(product.getQuantity() - item.getQuantity());

            // Tạo chi tiết đơn hàng
            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getUnitPrice() * item.getQuantity())
                    .build();
            orderDetails.add(detail);

            // Thêm nội dung email
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

        // 5. Lưu tất cả OrderDetail trong 1 batch
        orderDetailRepository.saveAll(orderDetails);

        // 6. Lưu lại danh sách product đã trừ tồn kho
        productRepository.saveAll(products);

        // 7. Gửi email
        try {
            emailService.sendOrderConfirmation(
                    order.getCustomerEmail(),
                    "Xác nhận đơn hàng",
                    emailContent.toString());
        } catch (Exception e) {
            System.out.println("Lỗi gửi email: " + e.getMessage());
        }

        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
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
