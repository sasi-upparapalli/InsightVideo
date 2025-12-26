import { useState } from "react";
import axios from "axios";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password
    });
    localStorage.setItem("token", res.data.token);
    window.location.reload();
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>InsightVideo</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#6366f1", cursor: "pointer" }}
            onClick={onSwitch}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
