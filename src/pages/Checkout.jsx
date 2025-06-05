import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import axios from "axios";
import useFullCartItems from "../hooks/useFullCartItems";
import swishLogo from "../images/swish.jpg";
import "../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { removeFromCart, updateQuantity, getCartItems, clearCart } = useCart();
  const fullCartItems = useFullCartItems();
  const { user } = useAuth();

  const [cardError, setCardError] = useState("");
  const [swishError, setSwishError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [swishNumber, setSwishNumber] = useState("");
  const [cardInfo, setCardInfo] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [deliveryErrors, setDeliveryErrors] = useState({
    name: false,
    address: false,
    city: false,
    postalCode: false,
  });

  const totalPrice = fullCartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const deliveryFee = 30;
  const totalWithDelivery = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    setCardError("");
    setSwishError("");

    const newErrors = {
      name: !userDetails.name.trim(),
      address: !userDetails.address.trim(),
      city: !userDetails.city.trim(),
      postalCode: !userDetails.postalCode.trim(),
    };
    setDeliveryErrors(newErrors);

    const hasDeliveryError = Object.values(newErrors).some(Boolean);
    if (hasDeliveryError) return;

    if (paymentMethod === "credit") {
      const { name, number, expiry, cvv } = cardInfo;
      if (
        !name ||
        !number.match(/^\d{13,19}$/) ||
        !expiry ||
        !cvv.match(/^\d{3}$/)
      ) {
        setCardError("Please enter valid credit card information.");
        return;
      }
    } else if (paymentMethod === "swish") {
      if (!swishNumber.match(/^(\+46|0)7\d{8}$/)) {
        setSwishError("Please enter a valid Swedish phone number.");
        return;
      }
    }

    try {
      const userId = user?.id ?? 0;
      const items = await getCartItems();
      if (items.length === 0) return;

      const orderItems = fullCartItems.map(
        ({ menuItemId, name, quantity, price }) => ({
          menuItemId,
          name,
          quantity,
          price,
        })
      );

      const total = fullCartItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );

      const response = await axios.post("http://localhost:3001/orders", {
        userId,
        items: orderItems.map(({ menuItemId, quantity }) => ({
          menuItemId,
          quantity,
        })),
        total,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: paymentMethod === "credit" ? "Credit Card" : "Swish",
        name: userDetails.name,
        address: userDetails.address,
        city: userDetails.city,
        postalCode: userDetails.postalCode,
      });

      const savedOrder = response.data;
      await clearCart();

      navigate("/confirmation", {
        state: {
          orderId: savedOrder.id,
          date: savedOrder.date,
          items: orderItems,
          total,
          paymentMethod,
          name: userDetails.name,
          address: userDetails.address,
          city: userDetails.city,
          postalCode: userDetails.postalCode,
        },
      });
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <section className="checkout-section">
      <div className="container">
        <div className="row-center">
          <div className="col-custom">
            <div className="table-wrapper">
              <table className="checkout-table">
                <thead>
                  <tr>
                    <th className="header-title">Menu Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {fullCartItems.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        <p>Your cart is empty.</p>
                      </td>
                    </tr>
                  ) : (
                    fullCartItems.map(
                      ({
                        menuItemId,
                        name,
                        price,
                        quantity,
                        image,
                        description,
                      }) => (
                        <tr key={menuItemId}>
                          <td>
                            <div className="item-info">
                              {image && (
                                <img
                                  src={image}
                                  alt={name}
                                  className="item-img"
                                />
                              )}
                              <div className="item-text">
                                <p className="item-title">
                                  <strong>{name}</strong>
                                </p>
                                <p className="item-desc">{description}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="quantity-control">
                              <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    menuItemId,
                                    Number(e.target.value)
                                  )
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
                          </td>
                          <td>
                            <p className="price-text">{price} SEK</p>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="user-details-form">
              <h3>Delivery Information</h3>
              <div className="form-grid">
                {["name", "address", "city", "postalCode"].map((field) => (
                  <div
                    key={field}
                    className={`form-group ${
                      deliveryErrors[field] ? "error" : ""
                    }`}
                  >
                    <label>
                      {field === "postalCode"
                        ? "Postal Code"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        field === "postalCode"
                          ? "Postal Code"
                          : field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={userDetails[field]}
                      onChange={(e) =>
                        setUserDetails({
                          ...userDetails,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="payment-card">
              <div className="payment-content">
                <div className="payment-methods">
                  <form>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        checked={paymentMethod === "credit"}
                        onChange={() => setPaymentMethod("credit")}
                      />
                      <span>
                        <i className="fab fa-cc-mastercard"></i> Credit Card
                      </span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="payment"
                        value="swish"
                        checked={paymentMethod === "Swish"}
                        onChange={() => setPaymentMethod("Swish")}
                      />
                      <span>
                        <img
                          src={swishLogo}
                          alt="Swish Logo"
                          className="swish-logo"
                        />{" "}
                        Swish
                      </span>
                    </label>
                  </form>
                </div>

                <div className="payment-details">
                  {paymentMethod === "credit" ? (
                    <>
                      <div
                        className={`form-group ${
                          cardError && !cardInfo.name ? "error" : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          value={cardInfo.name}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, name: e.target.value })
                          }
                        />
                        <label>Name on card</label>
                      </div>
                      <div
                        className={`form-group ${
                          cardError && !cardInfo.number.match(/^\d{13,19}$/)
                            ? "error"
                            : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="1111 2222 3333 4444"
                          value={cardInfo.number}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, number: e.target.value })
                          }
                        />
                        <label>Card Number</label>
                      </div>
                      <div
                        className={`form-group ${
                          cardError && !cardInfo.expiry ? "error" : ""
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardInfo.expiry}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, expiry: e.target.value })
                          }
                        />
                        <label>Expiration</label>
                      </div>
                      <div
                        className={`form-group ${
                          cardError && !cardInfo.cvv.match(/^\d{3}$/)
                            ? "error"
                            : ""
                        }`}
                      >
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardInfo.cvv}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, cvv: e.target.value })
                          }
                        />
                        <label>CVV</label>
                      </div>
                      {cardError && (
                        <div
                          className="error-text"
                          style={{ gridColumn: "1 / -1" }}
                        >
                          {cardError}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className={`form-group ${swishError ? "error" : ""}`}
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <input
                        type="tel"
                        pattern="^(\+46|0)7\d{8}$"
                        placeholder="+46"
                        value={swishNumber}
                        onChange={(e) => setSwishNumber(e.target.value)}
                      />
                      <label>Phone Number</label>
                      {swishError && (
                        <div className="error-text">{swishError}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="payment-summary">
                  <div className="summary-row">
                    <p>Subtotal</p>
                    <p>{totalPrice} SEK</p>
                  </div>
                  <div className="summary-row">
                    <p>Delivery fee</p>
                    <p>{deliveryFee} SEK</p>
                  </div>
                  <hr />
                  <div className="summary-row total">
                    <p>Total (tax included)</p>
                    <p>{totalWithDelivery} SEK</p>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    <span>Checkout</span>
                    <span>{totalWithDelivery} SEK</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
