import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/index";
import Modal from "../components/Modal"; // 🔥 import modal

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
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // 🔥 modal state

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();

      // Clear input fields
      setUsername("");
      setPassword("");
      setMessage(`Welcome ${result.role} (User ID: ${result.user_id})`);
    } catch (err) {
      // Show modal instead of inline error
      setMessage(auth.error || "Login failed. Please try again.");
      setShowModal(true);
    }
  }, [username, password, dispatch, auth.error]);

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

      {/* ✅ Modal for login error */}
      {showModal && (
        <Modal
          title="Login Failed"
          message={message}
          onClose={() => setShowModal(false)}
        />
      )}

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
