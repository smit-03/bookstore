import React, { createContext, useState, useEffect } from "react";
import request from "./request";
import { useAuthContext } from "./auth.context";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const authContext = useAuthContext();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userId = authContext.user.id;
                const response = await request.get(`/api/cart?userId=${userId}`);
                setCartItems(response);
            } catch (error) {
                console.error("Error getting cart items:", error);
            }
        };

        fetchCartItems();
    }, []);

    const addToCart = async (book) => {
        try {
            const userId = authContext.user.id;
            const body = {
                bookId: book.id,
                userId: userId,
                quantity: 1,
            };
            await request.post("/api/cart", body);
            setCartItems([...cartItems, book]);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await request.delete(`/api/cart?id=${cartItemId}`);
            const updatedCartItems = cartItems.filter((item) => item.id !== cartItemId);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const updateCartItemQuantity = async (cartItemId, newQuantity) => {
        try {
            const body = {
                id: cartItemId,
                bookId: cartItems.find((item) => item.id === cartItemId).bookId,
                userId: authContext.user.id,
                quantity: newQuantity,
            };
            await request.put("/api/cart", body);
            const updatedCartItems = cartItems.map((item) =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
