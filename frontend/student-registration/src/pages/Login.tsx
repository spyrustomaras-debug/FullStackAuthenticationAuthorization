import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/index";
import Modal from "../components/Modal";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(); // ✅ use i18n hook

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await dispatch(loginUser({ username, password })).unwrap();

        // Clear input fields
        setUsername("");
        setPassword("");
        setMessage(
          t("login.welcome", { role: result.role, id: result.user_id })
        );
      } catch (err) {
        // Show modal with translated error message
        setMessage(auth.error || t("login.failedMessage"));
        setShowModal(true);
      }
    },
    [username, password, dispatch, auth.error, t]
  );

  return (
    <div>
      <h2>{t("login.title")}</h2>
      <form onSubmit={handleLogin}>
        <Input
          placeholder={t("login.username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder={t("login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={auth.loading}>
          {auth.loading ? t("login.loggingIn") : t("login.submit")}
        </button>
      </form>

      {/* Modal for login error */}
      {showModal && (
        <Modal
          title={t("login.failedTitle")}
          message={message}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Welcome message after login */}
      {auth.role && (
        <div>
          <h3>{t("login.welcome", { role: auth.role, id: auth.user_id })}</h3>
          {auth.role === "student" && <p>{t("login.studentMessage")}</p>}
          {auth.role === "teacher" && <p>{t("login.teacherMessage")}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
