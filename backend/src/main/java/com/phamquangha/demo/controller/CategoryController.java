package com.phamquangha.demo.controller;

import com.phamquangha.demo.dto.CategoryDTO;
import com.phamquangha.demo.dto.CategoryWithProductsDTO;
import com.phamquangha.demo.dto.ProductDTO;
import com.phamquangha.demo.entity.Category;
import com.phamquangha.demo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // GET all categories
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categoryDTOs = categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDTOs);
    }

    // GET category by ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(convertToDTO(category)))
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryDTO dto) {
        try {
            Category category = new Category();
            category.setName(dto.getName());
            category.setSlug(dto.getSlug());
            return ResponseEntity.status(201).body(categoryRepository.save(category));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // PUT update category
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO dto) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isEmpty())
            return ResponseEntity.notFound().build();

        try {
            Category category = optionalCategory.get();
            category.setName(dto.getName());
            category.setSlug(dto.getSlug());
            return ResponseEntity.ok(categoryRepository.save(category));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // DELETE category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryWithProductsDTO> getCategoryWithProductsBySlug(@PathVariable String slug) {
        Optional<Category> categoryOpt = categoryRepository.findBySlug(slug);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Category category = categoryOpt.get();
        CategoryWithProductsDTO dto = new CategoryWithProductsDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());

        List<ProductDTO> productDTOs = category.getProducts().stream().map(product -> {
            ProductDTO p = new ProductDTO();
            p.setId(product.getId());
            p.setName(product.getName());
            p.setSlug(product.getSlug());
            p.setDescription(product.getDescription());
            p.setImage(product.getImage());
            p.setPrice(product.getPrice());
            p.setQuantity(product.getQuantity());
            p.setCategoryId(product.getCategory().getId());
            p.setBrandId(product.getBrand() != null ? product.getBrand().getId() : null);
            return p;
        }).toList();

        dto.setProducts(productDTOs);

        return ResponseEntity.ok(dto);
    }

    // Convert Category to CategoryDTO
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setProductIds(category.getProducts().stream()
                .map(product -> product.getId())
                .collect(Collectors.toList()));
        return dto;
    }
}
