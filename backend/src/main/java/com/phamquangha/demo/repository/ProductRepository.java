package com.phamquangha.demo.repository;

import com.phamquangha.demo.entity.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Lấy tất cả sản phẩm theo categoryId
    List<Product> findByCategoryId(Long categoryId);

    // Lấy sản phẩm theo categoryId và loại trừ 1 productId
    List<Product> findByCategoryIdAndIdNot(Long categoryId, Long excludeId);

    List<Product> findByNameContainingIgnoreCase(String keyword);

}
