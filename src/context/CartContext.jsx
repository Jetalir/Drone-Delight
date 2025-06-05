import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const LOCAL_KEY = "guest_cart";
const API_URL = "http://localhost:3001/cart";

export const CartProvider = ({ userId, children }) => {
  const isGuest = typeof userId === "undefined" || userId === null;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount or when userId changes
  useEffect(() => {
    if (isGuest) {
      loadLocalCart();
    } else if (userId) {
      fetchServerCart();
    }
  }, [userId]);

  useEffect(() => {
  if (isGuest) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cartItems));
  }
}, [cartItems, isGuest]);


  // Load Cart items from Local Storage
  const loadLocalCart = useCallback(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    setCartItems(stored ? JSON.parse(stored) : []);
    setLoading(false);
  }, []);

  // Save to Local Storage & state
  const saveLocalCart = useCallback((items) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    setCartItems(items);
  }, []);

  // Fetch cart from server
  const fetchServerCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}?userId=${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add item to cart
  // Replace your existing addToCart with this:
  const addToCart = async (menuItemId, quantity = 1) => {
    if (isGuest) {
      setCartItems((prevCart) => {
        const existing = prevCart.find(
          (item) => item.menuItemId === menuItemId
        );
        if (existing) {
          return prevCart.map((item) =>
            item.menuItemId === menuItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevCart, { menuItemId, quantity }];
        }
      });
      // Also update localStorage after state update
      setTimeout(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(cartItems));
      }, 0);
    } else {
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

  // Update item quantity or remove if less than 1
  const updateQuantity = async (menuItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(menuItemId);
      return;
    }

    if (isGuest) {
      const existing = cartItems.find((item) => item.menuItemId === menuItemId);
      let updatedCart;
      if (existing) {
        updatedCart = cartItems.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity } : item
        );
      } else {
        updatedCart = [...cartItems, { menuItemId, quantity }];
      }
      saveLocalCart(updatedCart);
    } else {
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
        fetchServerCart();
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    }
  };

  // Decrease quantity by 1
  const decreaseFromCart = (menuItemId) => {
    const existing = cartItems.find((item) => item.menuItemId === menuItemId);
    if (!existing) return;
    updateQuantity(menuItemId, existing.quantity - 1);
  };

  // Remove item from cart
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

  // Clear all cart items
  const clearCart = async () => {
    if (isGuest) {
      localStorage.removeItem(LOCAL_KEY);
      setCartItems([]);
    } else {
      try {
        await Promise.all(
          cartItems.map((item) => axios.delete(`${API_URL}/${item.id}`))
        );
        setCartItems([]);
      } catch (err) {
        console.error("Error clearing cart:", err);
      }
    }
  };

  // Get cart items enriched with full menu item data
  const getCartItems = async () => {
    try {
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
