import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/user/Login", {
        email: formData.email,
        password: formData.password,
      });

      // Save the token to localStorage
      const token = response.data.token;
      console.log(response.data.token)
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Token saved to localStorage:", token);
      }

      setFormData({
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging in user:", error);
      setMessage(
        error.response?.data?.message || "An error occurred during login."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

  const Btn = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure the container spans the full width
  };
  const passwordFieldStyle = {
    ...inputStyle,
    width: "calc(100% - 40px)", // Adjust width to account for the toggle button
    paddingRight: "40px",
  };
  const Form ={
    maxWidth: "400px", 
    margin: "0 auto",
    marginTop: "125px",
    border: "1px solid #d3d3d3", 
    padding: "50px",
    borderRadius:"5px"
 }
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

  return (
    <form
      onSubmit={handleSubmit}
      style={Form}
    >
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
      <div style={Btn}>
      <button type="submit" style={buttonStyle}>
        Login
      </button>
      <a href="/request-reset">Reset Password</a>
      <a href="/">Sign Up</a>
      </div>

      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
    </form>
  );
};

export default Login;
