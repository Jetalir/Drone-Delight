import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormTabs from "../components/FormTabs";
import useMDBInputInit from "../hooks/useMDBInputInit";
import "../styles/Register.css";

const Register = () => {

  useMDBInputInit();
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    let validationErrors = {};

    //Name validation
    if (formData.name === "" || formData.name === null) {
      isValid = false;
      validationErrors.name = "Please enter your name.";
    } else if (formData.name.length < 3) {
      isValid = false;
      validationErrors.name = "Your name must be at least 3 characters long.";
    } else if (formData.email === "" || formData.email === null) {
      isValid = false;
      validationErrors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      validationErrors.email = "Please enter a valid email address.";
    } else if (formData.password === "" || formData.password === null) {
      isValid = false;
      validationErrors.password = "Please enter your password.";
    } else if (formData.password.length < 6) {
      isValid = false;
      validationErrors.password = "Password must be at least 6 characters long.";
    } else if (formData.repeatPassword !== formData.password) {
      isValid = false;
      validationErrors.repeatPassword = "Passwords do not match.";
    } else if (!formData.termsAccepted) {
      isValid = false;
      validationErrors.termsAccepted = "You must accept the terms and conditions.";
    }

    setErrors(validationErrors);
    setValid(isValid);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:3001/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
        .then((result) => {
          alert("Registration successful!");
          Navigate("/login");
        })
        .catch(err => console.log(err));
    }
  };



  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <FormTabs activeTab="register" />
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="text"
            id="registerName"
            className="form-control"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <label className="form-label" htmlFor="registerName">
            Name
          </label>
        </div>

        {/* Email input */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="email"
            id="registerEmail"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <label className="form-label" htmlFor="registerEmail">
            Email
          </label>
        </div>

        {/* Password input */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="password"
            id="registerPassword"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <label className="form-label" htmlFor="registerPassword">
            Password
          </label>
        </div>

        {/* Repeat Password input */}
        <div data-mdb-input-init className="form-outline mb-4">
          <input
            type="password"
            id="registerRepeatPassword"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, repeatPassword: e.target.value })
            }
          />
          <label className="form-label" htmlFor="registerRepeatPassword">
            Repeat password
          </label>
        </div>

        {/* Checkbox */}
        <div className="form-check d-flex justify-content-center mb-4">
          <input
            className="form-check-input me-2"
            type="checkbox"
            value=""
            id="registerCheck"
            aria-describedby="registerCheckHelpText"
            onChange={(e) =>
              setFormData({ ...formData, termsAccepted: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="registerCheck">
            I have read and agree to the terms
          </label>
        </div>

        {/* Submit button */}
        <button
          data-mdb-ripple-init
          type="submit"
          className="btn btn-block mb-3"
          style={{ backgroundColor: "#E79B72" }}
        >
          Sign up
        </button>

        {/* Login link */}
        <div className="text-center">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
      {valid ? (
        <></>
      ) : (
        <span className="text-danger">
          {errors.name} {errors.email}
          {errors.password} {errors.repeatPassword}
          {errors.termsAccepted}
        </span>
      )}
    </div>
  );
};

export default Register;
