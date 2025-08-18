import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VnpayReturn = () => {
  const [message, setMessage] = useState("Đang xác nhận thanh toán từ VNPay");
  const [dotCount, setDotCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // hiệu ứng ...
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const processPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const responseCode = params.get("vnp_ResponseCode");

      const orderData = localStorage.getItem("vnpayOrderPayload");
      const isProcessed = localStorage.getItem("vnpayProcessed");

      if (responseCode === "00" && orderData && !isProcessed) {
        try {
          localStorage.setItem("vnpayProcessed", "true");
          const parsedData = JSON.parse(orderData);
          await axios.post("http://localhost:8081/api/orders", parsedData);

          localStorage.removeItem("vnpayOrderPayload");
          localStorage.removeItem("cart");

          setMessage("Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.");
        } catch (err) {
          setMessage("Gửi đơn hàng thất bại. Vui lòng liên hệ hỗ trợ.");
        } finally {
          setTimeout(() => {
            localStorage.removeItem("vnpayProcessed");
            navigate("/");
          }, 3000);
          setIsProcessing(false);
        }
      } else if (responseCode !== "00") {
        setMessage("Thanh toán thất bại hoặc bị hủy.");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      {isProcessing ? (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
        >
          <div className="text-center text-white">
            <h4>✅ {message}{'.'.repeat(dotCount)}</h4>
            <p>Vui lòng chờ trong giây lát.</p>
          </div>
        </div>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default VnpayReturn;
