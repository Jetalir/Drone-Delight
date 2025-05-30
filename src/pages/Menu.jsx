import React from "react";
import useFetch from "../hooks/useFetch";
import MenuItem from "../components/MenuItem";
import "../styles/Menu.css";

function Menu() {
  const { data: menuItems, loading, error } = useFetch("http://localhost:3001/menuItems");

  const handleAddToCart = (item) => {
    // Lägg till funktionen för lägg till i kundvagn genom CartContext
    console.log("Added to cart:", item);
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menuItems || menuItems.length === 0) return <p>No items found.</p>;
  
  return (
    <div className="menu">
      <h1>Menu</h1>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-card"> {/* Changed class name */}
            <MenuItem
              name={item.name}
              description={item.description}
              price={item.price}
              tags={item.tags}
              image={item.image}
            />
            <button className="addToCart" onClick={() => handleAddToCart(item)}>+</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;