import React, { useRef } from "react";
import "../styles/CategoryNav.css";

const CategoryNav = ({ categories, onSelectCategory, activeCategory }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -120 : 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="category-scroll-wrapper">
      <button className="category-scroll-btn left" onClick={() => scroll("left")}>
        ‹
      </button>

      <div className="category-nav" ref={scrollRef}>
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

      <button className="category-scroll-btn right" onClick={() => scroll("right")}>
        ›
      </button>
    </div>
  );
};

export default CategoryNav;
