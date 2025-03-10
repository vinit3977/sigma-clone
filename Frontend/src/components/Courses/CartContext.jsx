import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
        calculateTotal(savedCart);
    }, []);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + item.price, 0);
        setTotal(sum);
    };

    const addToCart = (course) => {
        const updatedCart = [...cart, course];
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const removeFromCart = (courseId) => {
        const updatedCart = cart.filter(item => item._id !== courseId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
        setTotal(0);
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            total, 
            addToCart, 
            removeFromCart, 
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);