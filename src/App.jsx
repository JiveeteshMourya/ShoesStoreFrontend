import { useCallback, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { getMeThunk } from "./store/slices/authSlice";
import { fetchCategoriesThunk } from "./store/slices/categoriesSlice";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ToastContainer from "./components/ui/Toast/ToastContainer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProfilePage from "./pages/buyer/ProfilePage";
import OrdersPage from "./pages/buyer/OrdersPage";
import OrderDetailPage from "./pages/buyer/OrderDetailPage";

import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import ProductFormPage from "./pages/seller/ProductFormPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerOrderDetailPage from "./pages/seller/SellerOrderDetailPage";
import ChatWidget from "./components/chatbot/ChatWidget";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMeThunk());
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const goToSection = useCallback((id, behavior = "smooth") => {
    const element = document.getElementById(id);
    if (!element) return false;
    const navbarHeight = window.innerWidth <= 768 ? 110 : 0.15 * window.innerHeight;
    window.scrollTo({ top: element.offsetTop - navbarHeight, behavior });
    return true;
  }, []);

  const navigateToSection = useCallback(
    id => {
      navigate(`/#${id}`);
      if (location.pathname === "/") goToSection(id);
    },
    [goToSection, location.pathname, navigate]
  );

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const sectionId = location.hash.slice(1);
    let attempts = 0;
    const intervalId = setInterval(() => {
      attempts += 1;
      const didScroll = goToSection(sectionId);
      if (didScroll || attempts >= 20) clearInterval(intervalId);
    }, 120);
    return () => clearInterval(intervalId);
  }, [goToSection, location.hash, location.pathname]);

  return (
    <>
      <Navbar navigateToSection={navigateToSection} />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage navigateToSection={navigateToSection} />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slugOrId" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<RoleRoute requiredRole="buyer" />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        </Route>

        <Route element={<RoleRoute requiredRole="seller" />}>
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<ProductFormPage />} />
          <Route path="/seller/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/orders/:orderId" element={<SellerOrderDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;
