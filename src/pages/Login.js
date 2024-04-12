import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function loginUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();

    if (data.user) {
      console.log("Login successful:", data.user);
      localStorage.setItem("token", data.user);
      navigate("/quote");
    } else {
      console.error("Login failed:", data.message);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={loginUser} className="form-login">
        <h1>Login</h1>
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input className="submit-button" type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
