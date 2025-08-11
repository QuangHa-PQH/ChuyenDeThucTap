package com.phamquangha.demo.service.impl;

import com.phamquangha.demo.entity.Brand;
import com.phamquangha.demo.repository.BrandRepository;
import com.phamquangha.demo.service.BrandService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand getBrandById(Long id) {
        return brandRepository.findById(id).orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    @Override
    public Brand createBrand(Brand brand) {
        brand.setSlug(generateSlug(brand.getName()));
        brand.setCreatedAt(LocalDateTime.now());
        return brandRepository.save(brand);
    }

    @Override
    public Brand updateBrand(Long id, Brand brand) {
        Brand existingBrand = getBrandById(id);
        existingBrand.setName(brand.getName());
        existingBrand.setDescription(brand.getDescription());
        existingBrand.setImage(brand.getImage());
        existingBrand.setSlug(generateSlug(brand.getName()));
        existingBrand.setUpdatedAt(LocalDateTime.now());
        return brandRepository.save(existingBrand);
    }

    // Hàm phụ trợ tạo slug
    private String generateSlug(String input) {
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }

    @Override
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}
