import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/Menu.css";

const MenuItemCard = ({ item }) => {
  const { cartItems, addToCart, removeFromCart, decreaseFromCart } = useCart();
  const { user, updateUser } = useAuth();
  const cartItem = cartItems.find((ci) => ci.menuItemId === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && Array.isArray(user.favoriteItems)) {
      setIsFavorite(user.favoriteItems.includes(item.id));
    } else {
      setIsFavorite(false);
    }
  }, [user, item.id]);

  const toggleFavorite = async () => {
    if (!user) return; // safety check

    const favoriteItems =
      user && Array.isArray(user.favoriteItems) ? user.favoriteItems : [];

    let updatedFavorites;
    if (favoriteItems.includes(item.id)) {
      updatedFavorites = favoriteItems.filter((id) => id !== item.id);
    } else {
      updatedFavorites = [...favoriteItems, item.id];
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/users/${user.id}`,
        {
          ...user,
          favoriteItems: updatedFavorites,
        }
      );

      updateUser(response.data);
      setIsFavorite(updatedFavorites.includes(item.id)); // set from updated list
    } catch (error) {
      console.error("Failed to update favorites", error);
    }
  };

  return (
    <div className="menu-item-card">
      <MenuItem
        name={item.name}
        description={item.description}
        price={item.price}
        tags={item.tags}
        image={item.image}
      />

      <div className="card-actions">
        {quantity > 0 ? (
          <div className="cart-controls active">
            <button
              className="decreaseQuantity"
              onClick={() =>
                quantity === 1
                  ? removeFromCart(item.id)
                  : decreaseFromCart(item.id)
              }
            >
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button
              className="increaseQuantity"
              onClick={() => addToCart(item.id)}
            >
              +
            </button>
          </div>
        ) : (
          <div className="cart-controls active single-button">
            <button className="addToCart" onClick={() => addToCart(item.id)}>
              +
            </button>
          </div>
        )}

        {user && (
          <button
            className={`favorite-button ${isFavorite ? "favorited" : ""}`}
            onClick={toggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            ♥
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
