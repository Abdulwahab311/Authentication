import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { id, token } = useParams();
  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    password: false,
    password_confirmation: false,
  });
  const [message, setMessage] = useState("");
const navigation = useNavigate();
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8000/user/UserResetPassword/${id}/${token}`,
        formData
      );
      setMessage(response.data.message);
navigation('/Login');
      setFormData({
        old_password: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const Form = {
    maxWidth: "400px",
    margin: "0 auto",
    marginTop: "125px",
    border: "1px solid #d3d3d3",
    padding: "50px",
    borderRadius: "5px",
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

  return (
    <form onSubmit={handleSubmit} style={Form}>
      <label style={labelStyle} htmlFor="old_password">
        Old Password:
      </label>
      <div style={{ position: "relative" }}>
        <input
          style={inputStyle}
          type={showPassword.old_password ? "text" : "password"}
          id="old_password"
          name="old_password"
          value={formData.old_password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility("old_password")}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showPassword.old_password ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <label style={labelStyle} htmlFor="password">
        New Password:
      </label>
      <div style={{ position: "relative" }}>
        <input
          style={inputStyle}
          type={showPassword.password ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility("password")}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showPassword.password ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <label style={labelStyle} htmlFor="password_confirmation">
        Confirm Password:
      </label>
      <div style={{ position: "relative" }}>
        <input
          style={inputStyle}
          type={showPassword.password_confirmation ? "text" : "password"}
          id="password_confirmation"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility("password_confirmation")}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showPassword.password_confirmation ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <button type="submit" style={buttonStyle}>
        Save Password
      </button>

      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
    </form>
  );
};

export default ResetPassword;