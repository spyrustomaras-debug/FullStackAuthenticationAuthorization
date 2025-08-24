import React, { useCallback, useState, Suspense } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/index";
import { useTranslation } from "react-i18next";

import "../styles/login.css"; // Import CSS

const Modal = React.lazy(() => import("../components/Modal"));

interface InputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = React.memo(
  ({ type = "text", placeholder, value, onChange }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="login-input"
    />
  )
);

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, role, user_id } = useSelector(
    (state: RootState) => ({
      loading: state.auth.loading,
      error: state.auth.error,
      role: state.auth.role,
      user_id: state.auth.user_id,
    }),
    shallowEqual
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
    []
  );
  const onPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const result = await dispatch(loginUser({ username, password })).unwrap();
        setUsername("");
        setPassword("");
        setMessage(t("login.welcome", { role: result.role, id: result.user_id }));
      } catch (err) {
        setMessage(error || t("login.failedMessage"));
        setShowModal(true);
      }
    },
    [username, password, dispatch, t, error]
  );

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">{t("login.title")}</h2>

        <form onSubmit={handleLogin} className="login-form">
          <Input
            placeholder={t("login.username")}
            value={username}
            onChange={onUsernameChange}
          />
          <Input
            type="password"
            placeholder={t("login.password")}
            value={password}
            onChange={onPasswordChange}
          />
          <button type="submit" disabled={loading} className="login-button">
            {loading ? t("login.loggingIn") : t("login.submit")}
          </button>
        </form>

        <Suspense fallback={null}>
          {showModal && (
            <Modal
              title={t("login.failedTitle")}
              message={message}
              onClose={() => setShowModal(false)}
            />
          )}
        </Suspense>

        {role && (
          <div className="login-welcome">
            <h3>{t("login.welcome", { role, id: user_id })}</h3>
            {role === "student" && <p>{t("login.studentMessage")}</p>}
            {role === "teacher" && <p>{t("login.teacherMessage")}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
