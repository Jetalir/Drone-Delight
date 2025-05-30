import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import FormTabs from "../components/FormTabs";
import useMDBInputInit from "../hooks/useMDBInputInit";

const Login = () => {
  useMDBInputInit();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    axios
      .post("http://localhost:5000/login", {
        name: formData.name,
        password: formData.password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("Login successful!");
        login(response.data.user);
        navigate("/");
      })
      .catch((err) => {
        setErrors({ login: "Invalid credentials" });
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <FormTabs activeTab="login" />
      <form onSubmit={handleSubmit}>
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="text"
            id="loginName"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className="form-label" htmlFor="loginName">
            Email or username
          </label>
        </div>

        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="password"
            id="loginPassword"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <label className="form-label" htmlFor="loginPassword">
            Password
          </label>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 d-flex justify-content-center">
            <div className="form-check mb-3 mb-md-0">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="loginCheck"
              />
              <label className="form-check-label" htmlFor="loginCheck">
                {" "}
                Remember me{" "}
              </label>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-center">
            {/* Simple link */}
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-block mb-4" style={{ backgroundColor: "#E79B72"}}>
          Sign in
        </button>

        {/* Register buttons */}
        <div className="text-center">
          <p>
            Not a member? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
      {valid ? (
        <></>
      ) : (
        <span className="text-danger">
          {errors.name} {errors.login} {errors.password}
        </span>
      )}
    </div>
  );
};

export default Login;
