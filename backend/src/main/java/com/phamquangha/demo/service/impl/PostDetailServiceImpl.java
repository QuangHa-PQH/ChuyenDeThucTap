package com.phamquangha.demo.service.impl;

import com.phamquangha.demo.entity.PostDetail;
import com.phamquangha.demo.repository.PostDetailRepository;
import com.phamquangha.demo.service.PostDetailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostDetailServiceImpl implements PostDetailService {

    private final PostDetailRepository postDetailRepository;

    public PostDetailServiceImpl(PostDetailRepository postDetailRepository) {
        this.postDetailRepository = postDetailRepository;
    }

    @Override
    public List<PostDetail> getAllPostDetails() {
        return postDetailRepository.findAll();
    }

    @Override
    public PostDetail getPostDetailById(Long id) {
        return postDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PostDetail not found"));
    }

    @Override
    public PostDetail createPostDetail(PostDetail postDetail) {
        postDetail.setCreatedAt(LocalDateTime.now());
        return postDetailRepository.save(postDetail);
    }

    @Override
    public PostDetail updatePostDetail(Long id, PostDetail postDetail) {
        PostDetail existingPostDetail = getPostDetailById(id);
        existingPostDetail.setContent(postDetail.getContent());
        existingPostDetail.setUpdatedAt(LocalDateTime.now());
        return postDetailRepository.save(existingPostDetail);
    }

    @Override
    public void deletePostDetail(Long id) {
        postDetailRepository.deleteById(id);
    }
}
