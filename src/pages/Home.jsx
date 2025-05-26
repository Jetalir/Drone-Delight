import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import "../styles/Home.css";

function Home() {

    const { data: products, loading, error } = useFetch("http://localhost:3001/menuItems");

    if (loading) return <p>Laddar produkter...</p>;
    if (error) return <p>Något gick fel: {error.message}</p>;

  return (
    <div>
      <div>
       <h2>Fresh food Zero traffic</h2>
       <p>Food Delivered by Drone in 20 Minutes or Less!</p>
      </div>
    
      <div className="product-list">
        
      </div>
    </div>
  );
}

export default Home;
