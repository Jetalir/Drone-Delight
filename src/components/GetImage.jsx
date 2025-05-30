import React, { useState, useEffect } from "react";

function CarouselImage({ image, name }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    async function loadImage() {
      try {
        const img = await import(`../images/${image}`);
        setImgSrc(img.default);
      } catch (err) {
        console.error("Error loading image:", err);
      }
    }
    loadImage();
  }, [image]);

  if (!imgSrc) return <div>Loading image...</div>;

  return <img src={imgSrc} alt={name} />;
}
export default CarouselImage;
