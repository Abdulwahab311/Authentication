import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ConfirmPassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    password: false,
    password_confirmation: false,
  });
  const navigate = useNavigate();

  // Retrieve token from localStorage (or another secure source)
  const token = localStorage.getItem("authToken");

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Validate password and confirmation
    if (!passwordRegex.test(formData.password)) {
      setMessage(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setMessage("Password and Confirm Password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/user/Change",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        }
      );

      console.log("Response:", response.data);
      setMessage("Password updated successfully!");
      setFormData({
        old_password: "",
        password: "",
        password_confirmation: "",
      });

      navigate("/login"); // Redirect after success
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage(
        error.response?.data?.message ||
          "An error occurred while updating the password."
      );
    }
  };
  const Form ={
    maxWidth: "400px", 
    margin: "0 auto",
    marginTop: "125px",
    border: "1px solid #d3d3d3", 
    padding: "50px",
    borderRadius:"5px"
 }

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
    <form
      onSubmit={handleSubmit}
      style={Form}
    >
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

export default ConfirmPassword;
