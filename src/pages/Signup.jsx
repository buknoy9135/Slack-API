import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";

function Signup() {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmSignupPassword, setConfirmSignupPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        email: signupEmail,
        password: signupPassword,
        password_confirmation: confirmSignupPassword,
      };

      if (signupPassword !== confirmSignupPassword) {
        alert("Passwords not matching. Try again");
        return;
      }

      if (!signupEmail || !signupPassword || !confirmSignupPassword) {
        alert("All fields are required.");
        return;
      }

      const response = await axios.post(`${API_URL}/auth/`, requestBody);

      const { data } = response;
      console.log(data);

      if (data.data) {
        alert(`Email: ${signupEmail} has been created successfully!`);
        setSignupEmail("");
        setSignupPassword("");
        setConfirmSignupPassword("");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error("Signup error:", error.response.data);
        const errors = error.response.data.errors;

        const message =
          Array.isArray(errors) && errors.length > 0
            ? errors[0]
            : "Signup failed.";

        alert(`Signup failed: ${message}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="email-input">
          <label>Email:</label>
          <input
            required
            placeholder="user@email.com"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />
        </div>
        <div className="password-input">
          <label>Password:</label>
          <input
            required
            placeholder="password"
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
        </div>
        <div className="confirm-password-input">
          <label>Confirm Password:</label>
          <input
            required
            placeholder="password"
            type="password"
            value={confirmSignupPassword}
            onChange={(e) => setConfirmSignupPassword(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
        <div className="login-prompt">
          Already have an account?
          <span onClick={() => navigate("/login")}>Sign in</span>
        </div>
      </form>
    </div>
  );
}

export default Signup;
