import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import WEDDINGPLANNER1 from "./pages/WEDDINGPLANNER1";
import WEDDING1 from "./pages/WEDDING1";
import WEDDINGPLANNER2 from "./pages/WEDDINGPLANNER2";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CategoryPage from "./pages/CategoryPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import VNPayPaymentPage from "./pages/VNPayPaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import VendorProfilePage from "./pages/VendorProfilePage";


import { Analytics } from "@vercel/analytics/react";


function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
      case "/home":
        title = "Trang chủ - AN Wedding";
        metaDescription = "AN Wedding - Nền tảng đặt dịch vụ cưới hàng đầu.";
        break;
      case "/about":
        title = "Về chúng tôi - AN Wedding";
        metaDescription = "Tìm hiểu câu chuyện, sứ mệnh, giá trị cốt lõi và đội ngũ sáng lập của AN Wedding.";
        break;
      case "/partner":
        title = "Wedding Planner - AN Wedding";
        metaDescription = "Tìm đối tác cưới tin cậy tại AN Wedding.";
        break;
      case "/nha_hang":
        title = "Nhà hàng tiệc cưới - AN Wedding";
        metaDescription = "Khám phá không gian tiệc cưới đẳng cấp.";
        break;
      case "/payment/vnpay":
        title = "Cổng thanh toán VNPay - AN Wedding";
        metaDescription = "Mô phỏng thanh toán dịch vụ cưới hỏi qua VNPay.";
        break;
      case "/payment/success":
        title = "Thanh toán thành công - AN Wedding";
        metaDescription = "Thanh toán dịch vụ cưới hoàn thành.";
        break;
      case "/vendor/dashboard":
        title = "Bảng quản lý Nhà cung cấp - AN Wedding";
        metaDescription = "Quản lý dịch vụ cưới và báo giá của bạn.";
        break;
      case "/admin/dashboard":
        title = "Bảng quản trị hệ thống - AN Wedding";
        metaDescription = "Theo dõi thống kê doanh thu toàn sàn, quản lý người dùng và duyệt đơn thanh toán.";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<WEDDING1 />} />
        <Route path="/home" element={<WEDDING1 />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/partner" element={<WEDDINGPLANNER1 />} />
        <Route path="/nha_hang" element={<CategoryPage defaultCategory="nha_hang" />} />
        <Route path="/category/:categoryType" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/payment/vnpay" element={<VNPayPaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/:id" element={<VendorProfilePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
