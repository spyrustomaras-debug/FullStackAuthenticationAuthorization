import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/index";

// ---------------- Input Component ----------------
interface InputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="login-input"
  />
);


const Login = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Type here
  const auth = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const result = await dispatch(loginUser({ username, password })).unwrap();
    console.log("Logged in user:", result);
    alert(`Welcome ${result.role} (User ID: ${result.user_id})`);

    // Clear input fields after successful login
    setUsername("");
    setPassword("");
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Check console for details.");
  }
};


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={auth.loading}>
          {auth.loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {auth.error && <p style={{ color: "red" }}>{auth.error}</p>}

      {auth.role && (
        <div>
          <h3>Welcome, {auth.role}</h3>
          {auth.role === "student" && <p>You are a student user!</p>}
          {auth.role === "teacher" && <p>You are a teacher user!</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
