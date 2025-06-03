import React from "react";
import axios from "axios";
import OrderHistory from "../components/OrderHistory";
import "../styles/Profile.css";

const Profile = () => {

  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:5000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.response.data));



  return <div><OrderHistory/></div>;
};

export default Profile;
