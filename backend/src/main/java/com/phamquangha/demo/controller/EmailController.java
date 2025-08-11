package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.OrderRequest;
import com.phamquangha.demo.service.EmailService;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/api/emails")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest) {
        // xử lý lưu đơn hàng vào DB...

        // xây nội dung HTML email
        StringBuilder itemListHtml = new StringBuilder();
        itemListHtml.append("<ul>");
        for (OrderRequest.OrderItem item : orderRequest.getItems()) {
            itemListHtml.append("<li>")
                    .append(item.getProductName())
                    .append(" - ")
                    .append(item.getQuantity())
                    .append(" x ")
                    .append(String.format("%.0f", item.getUnitPrice()))
                    .append(" VND</li>");
        }
        itemListHtml.append("</ul>");

        String emailContent = "<h3>🎉 Cảm ơn bạn đã đặt hàng, " + orderRequest.getCustomerName() + "!</h3>"
                + "<p><strong>Thông tin đơn hàng:</strong></p>"
                + itemListHtml
                + "<p><strong>Tổng tiền:</strong> " + String.format("%.0f", orderRequest.getTotalAmount()) + " VND</p>"
                + "<p><strong>Địa chỉ giao hàng:</strong> " + orderRequest.getDeliveryAddress() + "</p>"
                + "<p><strong>Số điện thoại:</strong> " + orderRequest.getCustomerPhone() + "</p>"
                + "<p><strong>Ghi chú:</strong> "
                + (orderRequest.getNote() != null ? orderRequest.getNote() : "Không có") + "</p>"
                + "<p>Shop sẽ liên hệ và giao hàng trong thời gian sớm nhất!</p>";

        try {
            emailService.sendOrderConfirmation(
                    orderRequest.getCustomerEmail(),
                    "Xác nhận đơn hàng từ Shop",
                    emailContent);
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi gửi email.");
        }

        return ResponseEntity.ok("Đơn hàng đã được xử lý và email đã được gửi.");
    }
}
