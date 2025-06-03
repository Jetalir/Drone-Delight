// src/components/MenuItemCard.jsx
import React from "react";
import MenuItem from "./MenuItem";
import { useCart } from "../context/CartContext";
import "../styles/Menu.css";

const MenuItemCard = ({ item }) => {
  const { cartItems, addToCart, removeFromCart, decreaseFromCart } = useCart();

  const cartItem = cartItems.find((ci) => ci.menuItemId === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="menu-item-card">
      <MenuItem
        name={item.name}
        description={item.description}
        price={item.price}
        tags={item.tags}
        image={item.image}
      />

      {quantity > 0 ? (
        <div className={`cart-controls ${quantity > 0 ? "active" : ""}`}>

          {quantity === 1 ? (
            <button
              className="decreaseQuantity"
              onClick={() => removeFromCart(item.id)}
            >
              -
            </button>
          ) : (
            <button
              className="decreaseQuantity"
              onClick={() => decreaseFromCart(item.id)}
            >
              -
            </button>
          )}
          <span className="quantity">{quantity}</span>
          <button
            className="increaseQuantity"
            onClick={() => addToCart(item.id)}
          >
            +
          </button>
        </div>
      ) : (
        <button className="addToCart" onClick={() => addToCart(item.id)}>
          +
        </button>
      )}
    </div>
  );
};

export default MenuItemCard;
