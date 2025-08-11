package com.phamquangha.demo.controller;

import com.phamquangha.demo.entity.Contact;
import com.phamquangha.demo.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Cho phép frontend React truy cập
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactRepository contactRepo;

    // POST: Gửi liên hệ từ người dùng
    @PostMapping
    public Contact submitContact(@RequestBody Contact message) {
        return contactRepo.save(message);
    }

    // GET: Lấy tất cả liên hệ (cho admin)
    @GetMapping
    public List<Contact> getAllContacts() {
        return contactRepo.findAll();
    }

    // DELETE: Xóa liên hệ theo ID (cho admin)
    @DeleteMapping("/{id}")
    public void deleteContact(@PathVariable Long id) {
        contactRepo.deleteById(id);
    }
}
