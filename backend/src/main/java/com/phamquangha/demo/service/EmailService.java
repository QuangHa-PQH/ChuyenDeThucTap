package com.phamquangha.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(String toEmail, String subject, String content) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        System.out.println("Gửi email đến: " + toEmail);

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(content, true); // true nếu có HTML

        System.out.println("Sending email to: " + toEmail);
        mailSender.send(message);
    }
}
