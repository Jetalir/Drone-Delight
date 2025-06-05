import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        const ordersRes = await fetch(`http://localhost:3001/orders?userId=${user.id}`);
        const ordersData = await ordersRes.json();

        const menuRes = await fetch("http://localhost:3001/menuItems");
        const menuData = await menuRes.json();

        setOrders(ordersData);
        setMenuItems(menuData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  function getItemName(id) {
    const item = menuItems.find((menuItem) => menuItem.id === id.toString());
    return item ? item.name : "Unknown Item";
  }

  if (!user) return <p className="error">Please log in to see your order history.</p>;
  if (loading) return <p>Loading your orders...</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="container order-history">
      <h1>Your Order History</h1>
      <div className="order-cards">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <p><span className="label">Order ID:</span> {order.id}</p>
            <p><span className="label">Date:</span> {order.date}</p>
            <p><span className="label">Items:</span></p>
            <ul>
              {order.items.map(({ menuItemId, quantity }) => (
                <li key={menuItemId}>
                  {getItemName(menuItemId)} x {quantity}
                </li>
              ))}
            </ul>
            <p><span className="label">Total:</span> {order.total} SEK</p>
            <p><span className="label">Payment Method:</span> {order.paymentMethod}</p>
            <p><span className="label">Name:</span> {order.name}</p>
            <p><span className="label">Delivery Address:</span> {order.address}, {order.city} {order.postalCode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
