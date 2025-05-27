import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import "../styles/Home.css";

function Home() {

    const { data: products, loading, error } = useFetch("http://localhost:3001/menuItems");
  
    if (loading) return <div>Loading menu...</div>;
    if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-container">
      <div className="hero-container">
       <h2>Fresh food Zero traffic</h2>
       <p>Food Delivered by Drone in 20 Minutes or Less!</p>
       <input type="text" placeholder="Search for adress..." className="adress-input" />
      </div>
    
      <div className="product-list">
        
      </div>
    </div>
  );
}

export default Home;
