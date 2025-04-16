import { Routes, Route, useLocation } from "react-router";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/ContactUS/ContactUs";
import OnlineTraining from "./components/DropDown/OnlineTraining";
import Corporate from "./components/DropDown/Corporate";
import ITstaffing from "./components/DropDown/ITstaffing";
import Courses from "./components/Courses/Courses";
import Header from "./components/Home/Header";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AdminDashboard from "./AdminDashboard";
import "./App.css";
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./components/Home/Footer";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { CartProvider } from "./components/Courses/CartContext";
import Cart from "./components/Courses/Cart";
import Checkout from "./components/Courses/Checkout";
import PaymentPage from "./components/Courses/PaymentPage";
import ProfilePage from "./components/Profile/ProfilePage";
import TransactionDetail from "./components/Profile/TransactionDetail";
import { useEffect } from "react";
import { LoadingProvider } from "./components/LoadingContext/LoadingContext";
import { useLoading } from "./components/LoadingContext/LoadingContext";
import Loader from "./components/Loader/Loader";

function AppContent() {
  const location = useLocation();
  const { isLoading } = useLoading();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-view');
      } else {
        document.body.classList.remove('mobile-view');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {location.pathname !== "/login" && 
       location.pathname !== "/signup" && 
       location.pathname !== "/payment" && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/OnlineTraining" element={<OnlineTraining />} />
        <Route path="/Corporate" element={<Corporate />} />
        <Route path="/ITstaffing" element={<ITstaffing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
      </Routes>
      {location.pathname !== "/login" && 
       location.pathname !== "/signup" && 
       location.pathname !== "/payment" && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LoadingProvider>
          <AppContent />
        </LoadingProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
