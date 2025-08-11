package com.phamquangha.demo.controller;

import com.phamquangha.demo.entity.PostDetail;
import com.phamquangha.demo.service.PostDetailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post-details")
public class PostDetailController {

    private final PostDetailService postDetailService;

    public PostDetailController(PostDetailService postDetailService) {
        this.postDetailService = postDetailService;
    }

    @GetMapping
    public List<PostDetail> getAllPostDetails() {
        return postDetailService.getAllPostDetails();
    }

    @GetMapping("/{id}")
    public PostDetail getPostDetailById(@PathVariable Long id) {
        return postDetailService.getPostDetailById(id);
    }

    @PostMapping
    public PostDetail createPostDetail(@RequestBody PostDetail postDetail) {
        return postDetailService.createPostDetail(postDetail);
    }

    @PutMapping("/{id}")
    public PostDetail updatePostDetail(@PathVariable Long id, @RequestBody PostDetail postDetail) {
        return postDetailService.updatePostDetail(id, postDetail);
    }

    @DeleteMapping("/{id}")
    public void deletePostDetail(@PathVariable Long id) {
        postDetailService.deletePostDetail(id);
    }
}
