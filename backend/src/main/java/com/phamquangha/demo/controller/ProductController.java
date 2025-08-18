package com.phamquangha.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDateTime;

import com.phamquangha.demo.entity.Category;
import com.phamquangha.demo.entity.Brand;
import com.phamquangha.demo.entity.Product;
import com.phamquangha.demo.service.ProductService;
import com.phamquangha.demo.repository.CategoryRepository;
import com.phamquangha.demo.repository.ProductRepository;
import com.phamquangha.demo.repository.BrandRepository;
import com.phamquangha.demo.dto.ProductDTO; // Import DTO

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // cho phép từ React
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository; // Inject CategoryRepository

    @Autowired
    private BrandRepository brandRepository; // Inject BrandRepository

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDTO> productDTOs = new ArrayList<>();
        String baseUrl = "http://localhost:8081/uploads/images/";

        for (Product product : products) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setId(product.getId());
            productDTO.setName(product.getName());
            productDTO.setSlug(product.getSlug());
            productDTO.setDescription(product.getDescription());
            productDTO.setPrice(product.getPrice());
            productDTO.setQuantity(product.getQuantity());
            productDTO.setImage(product.getImage() != null ? baseUrl + product.getImage() : null);
            productDTO.setCategoryId(product.getCategory().getId());
            productDTO.setBrandId(product.getBrand().getId());

            productDTOs.add(productDTO);
        }

        return productDTOs;
    }

    @GetMapping("/search")
    public List<ProductDTO> searchProducts(@RequestParam String keyword) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(keyword);
        List<ProductDTO> productDTOs = new ArrayList<>();

        for (Product product : products) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setId(product.getId());
            productDTO.setName(product.getName());
            productDTO.setSlug(product.getSlug());
            productDTO.setDescription(product.getDescription());
            productDTO.setPrice(product.getPrice());
            productDTO.setQuantity(product.getQuantity());
            productDTO.setImage(product.getImage());
            productDTO.setCategoryId(product.getCategory().getId());
            productDTO.setBrandId(product.getBrand().getId());

            productDTOs.add(productDTO);
        }

        return productDTOs;
    }

    // Phương thức lấy chi tiết sản phẩm theo id
    @GetMapping("/{id:[\\d]+}")
    public ProductDTO getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // Chuyển đổi sản phẩm thành ProductDTO
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setSlug(product.getSlug());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setQuantity(product.getQuantity());
        productDTO.setImage(product.getImage());
        productDTO.setCategoryId(product.getCategory().getId()); // Lấy ID của category
        productDTO.setBrandId(product.getBrand().getId()); // Lấy ID của brand

        return productDTO;
    }

    @PostMapping
    public Product createProduct(@RequestBody ProductDTO productDTO) {
        // Tạo đối tượng Category và Brand từ các id
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(productDTO.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Tạo đối tượng Product và lưu vào DB
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setSlug(productDTO.getSlug());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setImage(productDTO.getImage());
        product.setCategory(category);
        product.setBrand(brand);
        product.setCreatedAt(LocalDateTime.now());

        return productService.saveProduct(product);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ProductDTO updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("slug") String slug,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("brandId") Long brandId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        Product existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            throw new RuntimeException("Product not found");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        String fileName = existingProduct.getImage(); // giữ nguyên ảnh cũ
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                String uploadDir = "uploads/images/";
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);

                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Files.copy(imageFile.getInputStream(),
                        uploadPath.resolve(fileName),
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage());
            }
        }

        existingProduct.setName(name);
        existingProduct.setSlug(slug);
        existingProduct.setDescription(description);
        existingProduct.setPrice(price);
        existingProduct.setQuantity(quantity);
        existingProduct.setImage(fileName);
        existingProduct.setCategory(category);
        existingProduct.setBrand(brand);

        Product updatedProduct = productService.saveProduct(existingProduct);

        ProductDTO dto = new ProductDTO();
        dto.setId(updatedProduct.getId());
        dto.setName(updatedProduct.getName());
        dto.setSlug(updatedProduct.getSlug());
        dto.setDescription(updatedProduct.getDescription());
        dto.setPrice(updatedProduct.getPrice());
        dto.setQuantity(updatedProduct.getQuantity());
        dto.setImage(updatedProduct.getImage());
        dto.setCategoryId(updatedProduct.getCategory().getId());
        dto.setBrandId(updatedProduct.getBrand().getId());

        return dto;
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PostMapping(consumes = "multipart/form-data")
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam("slug") String slug,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("brandId") Long brandId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        String fileName = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                String uploadDir = "uploads/images/";
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);

                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Files.copy(imageFile.getInputStream(),
                        uploadPath.resolve(fileName),
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage());
            }
        }

        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setDescription(description);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setImage(fileName);
        product.setCategory(category);
        product.setBrand(brand);
        product.setCreatedAt(LocalDateTime.now());

        return productService.saveProduct(product);
    }

    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            registry.addResourceHandler("/uploads/images/**")
                    .addResourceLocations("file:uploads/images/");
        }
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(required = false) Long excludeId) {
        if (excludeId != null) {
            return productRepository.findByCategoryIdAndIdNot(categoryId, excludeId);
        } else {
            return productRepository.findByCategoryId(categoryId);
        }
    }

}
