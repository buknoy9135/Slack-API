import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataProvider";
import Prompt from "../parts/Prompt";
import "../css/Login.css";

function Login(props) {
  const { onLogin } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //prompt modal
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptHeading, setPromptHeading] = useState("");
  const [promptMessage, setPromptMessage] = useState("");

  const handlePromptClose = () => setPromptOpen(false);

  //automatically changing the path in the url
  const navigate = useNavigate();
  const { handleHeaders } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //authentication here
    try {
      const loginCredentials = {
        email,
        password,
      };

      const response = await axios.post(
        `${API_URL}/auth/sign_in`,
        loginCredentials
      );
      const { data, headers } = response;
      if (data && headers) {
        const accessToken = headers["access-token"];
        const expiry = headers["expiry"];
        const client = headers["client"];
        const uid = headers["uid"];

        console.log(data);
        console.log(data.data.id); //for profile details
        console.log(accessToken, expiry, client, uid);

        //keep the headers value in our context - these can now be used in other pages/components
        handleHeaders(headers);

        onLogin();
        navigate("/dashboard");
      }
    } catch (error) {
      if (error) {
        setPromptOpen(true);
        setPromptHeading("Wrong Credentials:");
        setPromptMessage("Invalid username or password.");
        return;
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="email-input">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="password-input">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {promptOpen && (
        <Prompt
          promptHeading={promptHeading}
          promptMessage={promptMessage}
          onClose={handlePromptClose}
        />
      )}

      {/* Sign up page */}
      <div className="signup-prompt">
        <span>
          Don't have an account? <a href="/signup">Sign Up</a>
        </span>
      </div>
    </div>
  );
}
export default Login;
