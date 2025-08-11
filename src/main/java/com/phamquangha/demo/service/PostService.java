package com.phamquangha.demo.service;

import com.phamquangha.demo.entity.Post;
import java.util.List;

public interface PostService {
    List<Post> getAllPosts();

    Post getPostById(Long id);

    Post createPost(Post post);

    Post updatePost(Long id, Post post);

    void deletePost(Long id);
}
