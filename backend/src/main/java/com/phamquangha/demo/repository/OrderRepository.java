package com.phamquangha.demo.repository;

import com.phamquangha.demo.entity.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT COUNT(o), COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Object[] getTotalOrdersAndRevenue();

}
