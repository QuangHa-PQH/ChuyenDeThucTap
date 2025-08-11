package com.phamquangha.demo.repository;

import com.phamquangha.demo.entity.Order;
import com.phamquangha.demo.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
        void deleteAllByOrder(Order order);

        List<OrderDetail> findByOrderId(Long orderId);

        // Tổng doanh thu cả năm
        @Query("SELECT SUM(od.totalPrice) FROM OrderDetail od WHERE YEAR(od.order.orderDate) = :year")
        Double getTotalRevenueByYear(@Param("year") int year);

        // Doanh thu theo tháng
        @Query("SELECT MONTH(od.order.orderDate), SUM(od.totalPrice) " +
                        "FROM OrderDetail od WHERE YEAR(od.order.orderDate) = :year " +
                        "GROUP BY MONTH(od.order.orderDate) ORDER BY MONTH(od.order.orderDate)")
        List<Object[]> getMonthlySales(@Param("year") int year);

        // Sản phẩm bán chạy
        @Query("SELECT od.product.id, od.product.name, SUM(od.quantity) as totalSold " +
                        "FROM OrderDetail od GROUP BY od.product.id, od.product.name " +
                        "ORDER BY totalSold DESC")
        List<Object[]> getBestSellingProducts();

}
