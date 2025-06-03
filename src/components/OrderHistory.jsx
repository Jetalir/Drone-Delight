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
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>
                {order.items.map(({ menuItemId, quantity }) => (
                  <div key={menuItemId}>
                    {getItemName(menuItemId)} x {quantity}
                  </div>
                ))}
              </td>
              <td>{order.total} SEK</td>
              <td>{order.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
