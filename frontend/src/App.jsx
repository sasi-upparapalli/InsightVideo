import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const token = localStorage.getItem("token");
  const [mode, setMode] = useState("login"); // login | register

  if (token) {
    return <Dashboard />;
  }

  return mode === "login" ? (
    <Login onSwitch={() => setMode("register")} />
  ) : (
    <Register onSwitch={() => setMode("login")} />
  );
}
