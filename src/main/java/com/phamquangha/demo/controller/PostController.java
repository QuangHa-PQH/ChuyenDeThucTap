package com.phamquangha.demo.controller;

import com.phamquangha.demo.entity.Post;
import com.phamquangha.demo.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    // Lấy tất cả bài viết (có thể sắp xếp nếu repo hỗ trợ)
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll(); // hoặc findAllByOrderByCreatedAtDesc nếu bạn có
    }

    // Lấy 1 bài viết theo ID
    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    // Thêm bài viết mới
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }

    // Sửa bài viết
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody Post updatedPost) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(updatedPost.getTitle());
            post.setSlug(updatedPost.getSlug());
            post.setDescription(updatedPost.getDescription());
            post.setImage(updatedPost.getImage());
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }

    // Xoá bài viết
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Long id) {
        return postRepository.findById(id).map(post -> {
            postRepository.delete(post);
            return "Deleted post with id: " + id;
        }).orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }
}
