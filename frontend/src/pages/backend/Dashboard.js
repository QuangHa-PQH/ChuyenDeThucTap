import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const Dashboard = () => {
  const [revenue, setRevenue] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/api/statistics/revenue")
      .then(res => setRevenue(res.data));

    axios.get("http://localhost:8081/api/statistics/monthly-sales")
      .then(res => {
        const sorted = res.data.sort((a, b) => a.month - b.month);
        const mapped = sorted.map(item => ({
          month: `Tháng ${item.month}`,
          totalSales: item.totalSales
        }));
        setMonthlySales(mapped);
      });

    axios.get("http://localhost:8081/api/statistics/best-sellers")
      .then(res => setBestSellers(res.data));
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  if (revenue === null) return <p className="text-center">Đang tải thống kê...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">📊 Thống kê tổng quan</h2>

      <div className="mb-4">
        <h4>
          Tổng doanh thu năm: <span className="text-success">{revenue.toLocaleString()}đ</span>
        </h4>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="mb-5">
        <h5>Doanh thu theo tháng</h5>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlySales}>
            <XAxis dataKey="month" />
            <YAxis width={100} />
            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
            <Bar dataKey="totalSales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ sản phẩm bán chạy */}
      <div>
        <h5>Sản phẩm bán chạy</h5>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={bestSellers}
              dataKey="totalSold"
              nameKey="productName"
              outerRadius={100}
              label
            >
              {bestSellers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;