import React from "react";
import axios from "axios";

const Profile = () => {

  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:5000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.response.data));



  return <div>Profile</div>;
};

export default Profile;
