package com.phamquangha.demo.repository;

import com.phamquangha.demo.entity.PostDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostDetailRepository extends JpaRepository<PostDetail, Long> {
}
