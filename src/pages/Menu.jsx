import React from "react";
import useFetch from "../hooks/useFetch";
import "../styles/Menu.css";

function Menu() {
  // Fetch ALL menu items (no ID filter)
  const { data: menuItems, loading, error } = useFetch("http://localhost:3001/menuItems");

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menuItems || menuItems.length === 0) return <p>No items found.</p>;
  
  return (
    <div className="menu">
      <h1>Menu</h1>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p><strong>{item.price} SEK</strong></p>
            {item.tags?.length > 0 && (
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
            <button className="addToCart">+</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;