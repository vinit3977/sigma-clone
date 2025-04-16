import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    return savedCart;
  });
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize cart and calculate total on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(sum);
  };

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(savedCart);
      calculateTotal(savedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (course) => {
    setIsLoading(true);
    const updatedCart = [...cart, course];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    setIsLoading(false);
  };

  const removeFromCart = (courseId) => {
    setIsLoading(true);
    const updatedCart = cart.filter((item) => item._id !== courseId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    setIsLoading(false);
  };

  const clearCart = () => {
    setIsLoading(true);
    setCart([]);
    localStorage.removeItem("cart");
    setTotal(0);
    setIsLoading(false);
  };

  // Update cart when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (JSON.stringify(savedCart) !== JSON.stringify(cart)) {
        setCart(savedCart);
        calculateTotal(savedCart);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
