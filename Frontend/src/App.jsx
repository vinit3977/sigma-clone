import { Routes, Route } from "react-router";
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Home />} />
          
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/OnlineTraining" element={<OnlineTraining />} />
          <Route path="/Corporate" element={<Corporate />} />
          <Route path="/ITstaffing" element={<ITstaffing />} />
          <Route
            path="/courses"
            element={
              // <ProtectedRoute>
                <Courses />
              // </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
