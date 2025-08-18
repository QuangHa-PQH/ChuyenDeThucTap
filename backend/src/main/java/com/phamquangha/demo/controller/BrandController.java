package com.phamquangha.demo.controller;

import com.phamquangha.demo.entity.Brand;
import com.phamquangha.demo.repository.BrandRepository;
import com.phamquangha.demo.dto.BrandDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;

    private final String uploadDir = "uploads/images/";

    @GetMapping
    public List<BrandDTO> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        List<BrandDTO> brandDTOs = new ArrayList<>();
        String baseUrl = "http://localhost:8081/uploads/images/";

        for (Brand brand : brands) {
            BrandDTO dto = new BrandDTO();
            dto.setId(brand.getId());
            dto.setName(brand.getName());
            dto.setSlug(brand.getSlug());
            dto.setImage(brand.getImage() != null ? baseUrl + brand.getImage() : null);

            List<Long> productIds = new ArrayList<>();
            brand.getProducts().forEach(p -> productIds.add(p.getId()));
            dto.setProductIds(productIds);

            brandDTOs.add(dto);
        }

        return brandDTOs;
    }

    @GetMapping("/{id}")
    public BrandDTO getBrandById(@PathVariable Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        String baseUrl = "http://localhost:8081/uploads/images/";

        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setSlug(brand.getSlug());
        dto.setImage(brand.getImage() != null ? baseUrl + brand.getImage() : null);

        List<Long> productIds = new ArrayList<>();
        brand.getProducts().forEach(p -> productIds.add(p.getId()));
        dto.setProductIds(productIds);

        return dto;
    }

    @PostMapping(consumes = "multipart/form-data")
    public Brand createBrand(
            @RequestParam("name") String name,
            @RequestParam("slug") String slug,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        String fileName = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            fileName = saveImage(imageFile);
        }

        Brand brand = new Brand();
        brand.setName(name);
        brand.setSlug(slug);
        brand.setImage(fileName);

        return brandRepository.save(brand);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public Brand updateBrand(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("slug") String slug,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(name);
        brand.setSlug(slug);

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            brand.setImage(fileName);
        }

        return brandRepository.save(brand);
    }

    @DeleteMapping("/{id}")
    public void deleteBrand(@PathVariable Long id) {
        brandRepository.deleteById(id);
    }

    private String saveImage(MultipartFile imageFile) {
        try {
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Files.copy(imageFile.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage());
        }
    }
}
