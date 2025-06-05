import React, { useState, useEffect } from "react";
import "../styles/Menu.css";

function MenuItem({ name, description, price, tags, image }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const importedImage = await import(`../images/${image}`);
        setImgSrc(importedImage.default);
      } catch (err) {
        console.error("Error loading image:", err);
      }
    };
    loadImage();
  }, [image]);

  return (
    <div className="menu-item">
      {imgSrc && <img src={imgSrc} className="dish-image" alt={name} />}
      <h2>{name}</h2>
      <p>{description}</p>
      <p><strong>{price} SEK</strong></p>
      {tags?.length > 0 && (
        <div className="tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuItem;
