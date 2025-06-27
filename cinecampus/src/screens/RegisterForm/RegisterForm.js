import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { register } from "../../services/backend";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    await register(username, password, email, confirmPassword)
      .then((response) => {
        alert("Registration successful! Please log in.");
        navigation("/login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="wrapper">
      <div>
        <h1>Register</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Register
        </button>
        <button type="button" onClick={() => navigation("/login")}>
          Already have an account?
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
