import { useState } from "react";
import axios from "axios";

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful. Please login.");
      onSwitch();
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>Create Account</h2>

        <input
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={register}>Register</button>

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#6366f1", cursor: "pointer" }}
            onClick={onSwitch}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
