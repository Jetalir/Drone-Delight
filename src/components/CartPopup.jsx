import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/CartPopup.css";
import useFullCartItems from "../hooks/useFullCartItems";

function CartPopup({ onClose, positionRef }) {
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const { removeFromCart, updateQuantity } = useCart();
  const fullCartItems = useFullCartItems();

  const [style, setStyle] = useState({});

  useEffect(() => {
    if (positionRef?.current) {
      const rect = positionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const popupWidth = 360;
      let left = rect.left + scrollLeft;
      const maxLeft = window.innerWidth - popupWidth - 16;
      if (left > maxLeft) left = maxLeft;
      setStyle({
        position: "absolute",
        top: rect.bottom + scrollTop + 8,
        left,
        zIndex: 9999,
      });
    }
  }, [positionRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        positionRef.current &&
        !positionRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, positionRef]);

  const totalPrice = fullCartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  return ReactDOM.createPortal(
    <div className="cart-popup-content" ref={cartRef} style={style}>
      <h3>Your Cart</h3>
      <div className="cart-items">
        {fullCartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          fullCartItems.map(({ menuItemId, name, price, quantity, image }) => (
            <div key={menuItemId} className="cart-item">
              {image && (
                <img src={image} alt={name} className="cart-item-image" />
              )}
              <div className="item-info">
                <strong>{name}</strong>
                <span className="price-tag">{price} SEK</span>
              </div>
              <div className="item-controls">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e =>
                    updateQuantity(menuItemId, Number(e.target.value))
                  }
                  className="qty-input"
                />
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(menuItemId)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <div className="total-line">
          <strong>Total:</strong>
          <span>{totalPrice.toFixed(2)} SEK</span>
        </div>
        <button
          className="checkout-btn"
          onClick={() => {
            navigate("/checkout");
            onClose();
          }}
        >
          Checkout
        </button>
      </div>
    </div>,
    document.body
  );
}

export default CartPopup;
