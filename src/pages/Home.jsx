import React, { useState, useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch";
import GetImage from "../components/GetImage";
import "../styles/Home.css";

function Home() {
  const {
    data: popularItems,
    loading,
    error,
  } = useFetch("http://localhost:3001/menuItems?category=Popular");

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null); // 'left' or 'right'

  const intervalRef = useRef(null);

  const resetAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSlideDirection("right");
      setPrevIndex(activeIndex);
      setActiveIndex((prev) =>
        popularItems && popularItems.length
          ? prev === popularItems.length - 1
            ? 0
            : prev + 1
          : 0
      );
    }, 3000);
  };

  const handlePrev = () => {
    setSlideDirection("left");
    setPrevIndex(activeIndex);
    setActiveIndex((prev) =>
      popularItems && popularItems.length
        ? prev === 0
          ? popularItems.length - 1
          : prev - 1
        : 0
    );
    resetAutoSlide();
  };

  const handleNext = () => {
    setSlideDirection("right");
    setPrevIndex(activeIndex);
    setActiveIndex((prev) =>
      popularItems && popularItems.length
        ? prev === popularItems.length - 1
          ? 0
          : prev + 1
        : 0
    );
    resetAutoSlide();
  };

  const goToSlide = (index) => {
    if (index === activeIndex) return; // no change
    setSlideDirection(index > activeIndex ? "right" : "left");
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    resetAutoSlide();
  };

  useEffect(() => {
    if (!popularItems || popularItems.length === 0) return;
    resetAutoSlide();

    return () => clearInterval(intervalRef.current);
  }, [popularItems]);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!popularItems || popularItems.length === 0)
    return <div>No popular items found.</div>;

  return (
    <div className="home-container">
      <div className="hero-container">
        <h2>Fresh food Zero traffic</h2>
        <p>Food Delivered by Drone in 20 Minutes or Less!</p>
        <input
          type="text"
          placeholder="Search for address..."
          className="adress-input"
        />
      </div>

      <section className="popular-dishes">
        <h2>Popular Dishes</h2>

        <div className="custom-carousel">
          <div className="carousel-wrapper">
              <button onClick={handlePrev} className="carousel-arrow left">‹</button>

            <div className="carousel-item-container">
              {popularItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`carousel-item ${
                    activeIndex === index
                      ? slideDirection === "right"
                        ? "slide-in-right active"
                        : "slide-in-left active"
                      : ""
                  }`}
                  style={{ display: activeIndex === index ? "flex" : "none" }}
                >
                  <div className="carousel-menu-item">
                    <GetImage image={item.image} name={item.name} />
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>
                      <strong>{item.price} SEK</strong>
                    </p>
                    <div className="tags">
                      {item.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

             <button onClick={handleNext} className="carousel-arrow right">›</button>

             <div className="carousel-indicators">
            {popularItems.map((_, index) => (
              <button
                key={index}
                className={`indicator-btn ${
                  activeIndex === index ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default Home;
