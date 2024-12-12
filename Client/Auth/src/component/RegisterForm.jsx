import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tc: false,
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!formData.tc) {
      setMessage("You must accept the terms and conditions to proceed.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setMessage(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/user/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        tc: formData.tc,
      });

      setMessage("Registration successful! Redirecting to login...");
      setFormData({
        name: "",
        email: "",
        password: "",
        tc: false,
      });
      setTimeout(() => navigate("/Login"), 2000);
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(
        error.response?.data?.message ||
          "An error occurred during registration."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Form = {
    maxWidth: "400px",
    margin: "0 auto",
    marginTop: "125px",
    border: "1px solid #d3d3d3",
    padding: "50px",
    borderRadius: "5px",
  };

  const Btn = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  };
  const passwordFieldStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "block",
    margin: "10px 0 5px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "10px 20px",
    marginTop: "15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  const checkboxStyle = {
    marginRight: "10px",
  };

  return (
    <form onSubmit={handleSubmit} style={Form}>
      <label style={labelStyle} htmlFor="name">
        Name:
      </label>
      <input
        style={inputStyle}
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label style={labelStyle} htmlFor="email">
        Email:
      </label>
      <input
        style={inputStyle}
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label style={labelStyle} htmlFor="password">
        Password:
      </label>
      <div style={{ position: "relative" }}>
        <input
          style={passwordFieldStyle}
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <label style={labelStyle}>
        <input
          style={checkboxStyle}
          type="checkbox"
          name="tc"
          checked={formData.tc}
          onChange={handleChange}
        />
        I accept the terms and conditions
      </label>
      <div style={Btn}>
        <button type="submit" style={buttonStyle}>
          Register
        </button>
        <a href="/Login">Sign In</a>
      </div>
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default RegisterForm;
