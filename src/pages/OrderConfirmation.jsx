import { useLocation, useNavigate } from "react-router-dom";
import "../styles/OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    navigate("/");
    return null;
  }

  const {
    orderId,
    date,
    items,
    total,
    paymentMethod,
    name,
    address,
    city,
    postalCode,
  } = location.state;

  return (
    <section className="order-confirmation">
      <div className="container">
        <h1>Thank you for your order!</h1>

        {orderId && (
          <p>
            Order Number: <strong>{orderId}</strong>
          </p>
        )}
        <p>Date: {date}</p>
        <p>
          Payment Method: {paymentMethod === "credit" ? "Credit Card" : "Swish"}
        </p>

        <h2>Delivery Information</h2>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Address:</strong> {address}, {city}, {postalCode}
        </p>

        <h2>Order Summary</h2>
        <table className="order-summary-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price (SEK)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ menuItemId, name, quantity, price }) => (
              <tr key={menuItemId}>
                <td>{name}</td>
                <td>{quantity}</td>
                <td>{price * quantity} SEK</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Total Paid: {total} SEK</h3>

        <button
          className="order-confirmation__btn"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </section>
  );
}

export default OrderConfirmation;
