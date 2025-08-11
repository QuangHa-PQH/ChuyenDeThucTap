package com.phamquangha.demo.service;

import com.phamquangha.demo.entity.PostDetail;
import java.util.List;

public interface PostDetailService {
    List<PostDetail> getAllPostDetails();

    PostDetail getPostDetailById(Long id);

    PostDetail createPostDetail(PostDetail postDetail);

    PostDetail updatePostDetail(Long id, PostDetail postDetail);

    void deletePostDetail(Long id);
}
