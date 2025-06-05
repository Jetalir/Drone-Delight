import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import CategoryNav from "../components/CategoryNav";
import MenuItemCard from "../components/MenuItemCard";
import { useAuth } from "../context/AuthContext";
import "../styles/Menu.css";

function Menu() {
  const {
    data: menuItems,
    loading,
    error,
  } = useFetch("http://localhost:3001/menuItems");
  const [activeCategory, setActiveCategory] = useState("All");
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state && location.state.filter) {
      setActiveCategory(location.state.filter);
    }
  }, [location.state]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menuItems || menuItems.length === 0) return <p>No items found.</p>;

  const baseCategories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];
  const categories = user
    ? ["Favorites", "Popular", ...baseCategories]
    : ["Popular", ...baseCategories];

  const uniqueCategories = [...new Set(categories)];

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : activeCategory === "Popular"
      ? menuItems.filter((item) => item.isPopular)
      : activeCategory === "Favorites" &&
        user &&
        Array.isArray(user.favoriteItems)
      ? menuItems.filter((item) => user.favoriteItems.includes(item.id))
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="menu">
      <h1>Menu</h1>

      <CategoryNav
        categories={uniqueCategories}
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
