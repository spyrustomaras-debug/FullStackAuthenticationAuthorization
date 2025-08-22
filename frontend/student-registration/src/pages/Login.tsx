import React, { useCallback, useState, Suspense } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store/index";
import { useTranslation } from "react-i18next";

// Lazy-load Modal to reduce initial JS execution
const Modal = React.lazy(() => import("../components/Modal"));

// ---------------- Input Component ----------------
interface InputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Memoized input to prevent unnecessary re-renders
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

  // Select specific auth fields to reduce re-renders
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

  // Memoized handlers for input fields
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
    <div>
      <h2>{t("login.title")}</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" disabled={loading}>
          {loading ? t("login.loggingIn") : t("login.submit")}
        </button>
      </form>

      {/* Modal for login error */}
      <Suspense fallback={null}>
        {showModal && (
          <Modal
            title={t("login.failedTitle")}
            message={message}
            onClose={() => setShowModal(false)}
          />
        )}
      </Suspense>

      {/* Welcome message after login */}
      {role && (
        <div>
          <h3>{t("login.welcome", { role, id: user_id })}</h3>
          {role === "student" && <p>{t("login.studentMessage")}</p>}
          {role === "teacher" && <p>{t("login.teacherMessage")}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
