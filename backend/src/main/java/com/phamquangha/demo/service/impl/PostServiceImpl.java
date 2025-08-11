package com.phamquangha.demo.service.impl;

import com.phamquangha.demo.entity.Post;
import com.phamquangha.demo.repository.PostRepository;
import com.phamquangha.demo.service.PostService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @Override
    public Post createPost(Post post) {
        post.setSlug(generateSlug(post.getTitle()));
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Long id, Post post) {
        Post existingPost = getPostById(id);
        existingPost.setTitle(post.getTitle());
        existingPost.setSlug(generateSlug(post.getTitle()));
        existingPost.setDescription(post.getDescription());
        existingPost.setImage(post.getImage());
        existingPost.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(existingPost);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    private String generateSlug(String input) {
        return input.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-");
    }
}
