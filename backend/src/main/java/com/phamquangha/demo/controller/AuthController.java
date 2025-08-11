package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.AuthRequest;
import com.phamquangha.demo.dto.AuthResponse;
import com.phamquangha.demo.dto.RegisterRequest;
import com.phamquangha.demo.entity.User;
import com.phamquangha.demo.repository.UserRepository;
import com.phamquangha.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setName(request.getName());

        // Kiểm soát role: nếu gửi sai hoặc trống thì gán mặc định ROLE_USER
        String role = request.getRole();
        if (role == null || (!role.equals("ROLE_ADMIN") && !role.equals("ROLE_USER"))) {
            role = "ROLE_USER";
        }

        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Sinh token
        String token = jwtUtil.generateToken(request.getUsername());

        // Tìm user trong DB
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Trả về thông tin đầy đủ
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(token);
        authResponse.setId(user.getId());
        authResponse.setUsername(user.getUsername());
        authResponse.setName(user.getName());
        authResponse.setEmail(user.getEmail());
        authResponse.setPhone(user.getPhone());
        authResponse.setRole(user.getRole());

        return ResponseEntity.ok(authResponse);
    }
}
