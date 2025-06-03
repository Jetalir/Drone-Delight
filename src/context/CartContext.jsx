// src/contexts/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const LOCAL_KEY = "guest_cart";
const API_URL = "http://localhost:3001/cart";

export const CartProvider = ({ userId, children }) => {
  const isGuest = !userId;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount or when changed
  useEffect(() => {
    isGuest ? loadLocalCart() : fetchServerCart();
  }, [userId]);

  // Load Cart items from Local Storage
  const loadLocalCart = () => {
    const stored = localStorage.getItem(LOCAL_KEY);
    setCartItems(stored ? JSON.parse(stored) : []);
    setLoading(false);
  };

  // Save to Local Storage
  const saveLocalCart = (items) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    setCartItems(items);
  };

  // Fetch item from server
  const fetchServerCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}?userId=${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (menuItemId, quantity = 1) => {
    if (isGuest) {
      // if not logged in, use local storage
      const existing = cartItems.find((item) => item.menuItemId === menuItemId);
      let updatedCart;
      if (existing) {
        updatedCart = cartItems.map((item) =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...cartItems, { menuItemId, quantity }];
      }
      saveLocalCart(updatedCart);
    } else {
      // if logged in, use json server
      try {
        const existing = cartItems.find(
          (item) => item.menuItemId === menuItemId
        );
        if (existing) {
          const updated = {
            ...existing,
            quantity: existing.quantity + quantity,
          };
          await axios.put(`${API_URL}/${existing.id}`, updated);
        } else {
          const newItem = { userId, menuItemId, quantity };
          await axios.post(API_URL, newItem);
        }
        fetchServerCart();
      } catch (err) {
        console.error("Error adding to cart:", err);
      }
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    if (quantity < 1) {
      // If quantity is less than 1, remove the item instead
      removeFromCart(menuItemId);
      return;
    }

    if (isGuest) {
      // Guest: update localStorage cart
      const existing = cartItems.find((item) => item.menuItemId === menuItemId);
      let updatedCart;
      if (existing) {
        updatedCart = cartItems.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity } : item
        );
      } else {
        // If item not in cart, add it with quantity
        updatedCart = [...cartItems, { menuItemId, quantity }];
      }
      saveLocalCart(updatedCart);
    } else {
      // Logged-in user: update server cart
      try {
        const existing = cartItems.find(
          (item) => item.menuItemId === menuItemId
        );
        if (existing) {
          const updated = { ...existing, quantity };
          await axios.put(`${API_URL}/${existing.id}`, updated);
        } else {
          const newItem = { userId, menuItemId, quantity };
          await axios.post(API_URL, newItem);
        }
        fetchServerCart(); // refresh after update
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    }
  };
  // Decrease item quantity
  const decreaseFromCart = (menuItemId) => {
    const existing = cartItems.find((item) => item.menuItemId === menuItemId);
    if (!existing) return;

    const newQuantity = existing.quantity - 1;
    updateQuantity(menuItemId, newQuantity);
  };

  // Remove item
  const removeFromCart = async (menuItemId) => {
    if (isGuest) {
      const updated = cartItems.filter(
        (item) => item.menuItemId !== menuItemId
      );
      saveLocalCart(updated);
    } else {
      const item = cartItems.find((item) => item.menuItemId === menuItemId);
      if (!item) return;
      try {
        await axios.delete(`${API_URL}/${item.id}`);
        fetchServerCart();
      } catch (err) {
        console.error("Error removing from cart:", err);
      }
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isGuest) {
      localStorage.removeItem(LOCAL_KEY);
      setCartItems([]);
    } else {
      try {
        const deletes = cartItems.map((item) =>
          axios.delete(`${API_URL}/${item.id}`)
        );
        await Promise.all(deletes);
        setCartItems([]);
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
  };

  // Get cart items enriched with full menu item data
  const getCartItems = async () => {
    try {
      // Fetch menu items
      const { data: menuItems } = await axios.get(
        "http://localhost:3001/menuItems"
      );

      return cartItems.map((cartItem) => {
        const menuItem = menuItems.find(
          (item) => String(item.id) === String(cartItem.menuItemId)
        );
        return {
          ...cartItem,
          ...menuItem,
        };
      });
    } catch (err) {
      console.error("Error fetching full cart items:", err);
      return cartItems;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        decreaseFromCart,
        refreshCart: isGuest ? loadLocalCart : fetchServerCart,
        getCartItems,
        updateQuantity, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
