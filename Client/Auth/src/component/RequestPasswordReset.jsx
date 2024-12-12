import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom"

const RequestPasswordReset = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/user/ResetPassword", {
        email: formData.email,
      });
      setMessage(response.data.message);
      
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
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

  const passwordFieldStyle = {
    ...inputStyle,
    paddingRight: "40px", // Adjust width for toggle button
  };

  const formStyle = {
    maxWidth: "400px",
    margin: "0 auto",
    marginTop: "125px",
    border: "1px solid #d3d3d3",
    padding: "50px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
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

  const linkStyle = {
    marginLeft: "10px",
    fontSize: "14px",
    color: "#007bff",
    textDecoration: "none",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
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
      <button type="submit" style={buttonStyle}>
        Reset Password
      </button>

      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
    </form>
  );
};

export default RequestPasswordReset;
