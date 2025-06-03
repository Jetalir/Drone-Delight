// components/CategoryNav.jsx
import React from "react";
import "../styles/CategoryNav.css";

const CategoryNav = ({ categories, onSelectCategory, activeCategory }) => {
  return (
    <div className="category-nav">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`category-button ${activeCategory === cat ? "active" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
