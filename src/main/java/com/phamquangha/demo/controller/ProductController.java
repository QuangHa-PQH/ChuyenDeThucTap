package com.phamquangha.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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

        for (Product product : products) {
            ProductDTO productDTO = new ProductDTO();
            productDTO.setId(product.getId());
            productDTO.setName(product.getName());
            productDTO.setSlug(product.getSlug());
            productDTO.setDescription(product.getDescription());
            productDTO.setPrice(product.getPrice());
            productDTO.setQuantity(product.getQuantity());
            productDTO.setImage(product.getImage());
            productDTO.setCategoryId(product.getCategory().getId()); // Lấy chỉ ID của category
            productDTO.setBrandId(product.getBrand().getId()); // Lấy chỉ ID của brand

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

    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        // Tìm sản phẩm theo ID
        Product existingProduct = productService.getProductById(id);

        if (existingProduct == null) {
            throw new RuntimeException("Product not found");
        }

        // Tìm Category và Brand từ ID
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Brand brand = brandRepository.findById(productDTO.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        // Cập nhật thông tin sản phẩm
        existingProduct.setName(productDTO.getName());
        existingProduct.setSlug(productDTO.getSlug());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setImage(productDTO.getImage());
        existingProduct.setCategory(category);
        existingProduct.setBrand(brand);

        // Lưu lại sản phẩm đã cập nhật
        Product updatedProduct = productService.saveProduct(existingProduct);

        // Chuyển đổi đối tượng sản phẩm đã cập nhật thành ProductDTO để trả về cho
        // client
        ProductDTO updatedProductDTO = new ProductDTO();
        updatedProductDTO.setId(updatedProduct.getId());
        updatedProductDTO.setName(updatedProduct.getName());
        updatedProductDTO.setSlug(updatedProduct.getSlug());
        updatedProductDTO.setDescription(updatedProduct.getDescription());
        updatedProductDTO.setPrice(updatedProduct.getPrice());
        updatedProductDTO.setQuantity(updatedProduct.getQuantity());
        updatedProductDTO.setImage(updatedProduct.getImage());
        updatedProductDTO.setCategoryId(updatedProduct.getCategory().getId());
        updatedProductDTO.setBrandId(updatedProduct.getBrand().getId());

        return updatedProductDTO;
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
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
