package com.phamquangha.demo.controller;

import com.phamquangha.demo.entity.Brand;
import com.phamquangha.demo.entity.Product;
import com.phamquangha.demo.repository.BrandRepository;
import com.phamquangha.demo.dto.BrandDTO; // Import DTO for Brand

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository; // Inject BrandRepository

    // Get all brands with product ids and brand images
    @GetMapping
    public List<BrandDTO> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        List<BrandDTO> brandDTOs = new ArrayList<>();

        for (Brand brand : brands) {
            BrandDTO brandDTO = new BrandDTO();
            brandDTO.setId(brand.getId());
            brandDTO.setName(brand.getName());
            brandDTO.setSlug(brand.getSlug());
            brandDTO.setImage(brand.getImage()); // Thêm hình ảnh của thương hiệu

            // Chỉ lấy ID của các sản phẩm trong brand
            List<Long> productIds = new ArrayList<>();
            for (Product product : brand.getProducts()) {
                productIds.add(product.getId());
            }
            brandDTO.setProductIds(productIds); // Lưu danh sách các ID của sản phẩm

            brandDTOs.add(brandDTO);
        }

        return brandDTOs;
    }

    @GetMapping("/{id}")
    public BrandDTO getBrandById(@PathVariable Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        BrandDTO brandDTO = new BrandDTO();
        brandDTO.setId(brand.getId());
        brandDTO.setName(brand.getName());
        brandDTO.setSlug(brand.getSlug());
        brandDTO.setImage(brand.getImage());

        List<Long> productIds = new ArrayList<>();
        for (Product product : brand.getProducts()) {
            productIds.add(product.getId());
        }
        brandDTO.setProductIds(productIds);

        return brandDTO;
    }

    @PostMapping
    public Brand createBrand(@RequestBody Brand brand) {
        return brandRepository.save(brand);
    }

    @PutMapping("/{id}")
    public Brand updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        return brandRepository.findById(id)
                .map(existingBrand -> {
                    existingBrand.setName(brand.getName());
                    existingBrand.setSlug(brand.getSlug());
                    existingBrand.setImage(brand.getImage()); // Cập nhật hình ảnh của thương hiệu
                    return brandRepository.save(existingBrand);
                })
                .orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteBrand(@PathVariable Long id) {
        brandRepository.deleteById(id);
    }
}
