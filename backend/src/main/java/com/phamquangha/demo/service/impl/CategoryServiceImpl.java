package com.phamquangha.demo.service.impl;

import com.phamquangha.demo.entity.Category;
import com.phamquangha.demo.repository.CategoryRepository;
import com.phamquangha.demo.service.CategoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public Category createCategory(Category category) {
        category.setSlug(generateSlug(category.getName()));
        category.setCreatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setSlug(generateSlug(category.getName()));
        existingCategory.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(existingCategory);
    }

    // Hàm phụ trợ để tạo slug
    private String generateSlug(String input) {
        return input.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-");
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
