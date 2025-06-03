import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import CategoryNav from "../components/CategoryNav";
import MenuItemCard from "../components/MenuItemCard";
import "../styles/Menu.css";

function Menu() {
  const { data: menuItems, loading, error } = useFetch("http://localhost:3001/menuItems");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menuItems || menuItems.length === 0) return <p>No items found.</p>;

  const categories = ["Popular", "All", ...new Set(menuItems.map(item => item.category))];

  const filteredItems = activeCategory === "All"
    ? menuItems
    : activeCategory === "Popular"
      ? menuItems.filter(item => item.isPopular)
      : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="menu">
      <h1>Menu</h1>

      <CategoryNav
        categories={categories}
        onSelectCategory={handleCategorySelect}
        activeCategory={activeCategory}
      />

      <div className="menu-items">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Menu;
