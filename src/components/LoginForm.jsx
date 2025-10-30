import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postLogin from "../api/post-login";
import { useAuth } from "../hooks/use-auth";
import getCurrentUserByUsername from "../api/get-current-user";
import "./SharedForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    //Username Validation
    if (!credentials.username.trim()) {
      // trim removes whitespace
      newErrors.username = "Username required";
      isValid = false;
    }

    // Password Validation
    if (!credentials.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));

    // clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      postLogin(credentials.username, credentials.password)
        .then((response) => {
          const token = response.token;
          window.localStorage.setItem("token", `Token ${token}`);
          // Try to fetch the full user/profile from the API. If that fails,
          // fall back to storing the minimal username object so UI checks still work.
          getCurrentUserByUsername(credentials.username)
            .then((user) => {
              window.localStorage.setItem("user", JSON.stringify(user));
              setAuth({ token: `Token ${token}`, user });
              navigate("/");
            })
            .catch(() => {
              const minimal = { username: credentials.username };
              window.localStorage.setItem("user", JSON.stringify(minimal));
              setAuth({ token: `Token ${token}`, user: minimal });
              navigate("/");
            });
          navigate("/");
        })
        .catch(() => {
          setErrors({
            username: "Invalid username or password",
            password: "Invalid username or password",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="form-header">
          <h1>LOGIN</h1>
        </div>

        <div className={`form-group ${errors.username ? "error" : ""}`}>
          <label htmlFor="username">USERNAME</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            onChange={handleChange}
            value={credentials.username}
            disabled={isLoading}
          />
          {errors.username && (
            <span className="form-error-message">{errors.username}</span>
          )}
        </div>

        <div className={`form-group ${errors.password ? "error" : ""}`}>
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={credentials.password}
            disabled={isLoading}
          />
          {errors.password && (
            <span className="form-error-message">{errors.password}</span>
          )}
        </div>

        <button className="form-btn" type="submit" disabled={isLoading}>
          {isLoading ? "LOGGING IN..." : "SIGN IN"}
        </button>

        <div className="form-divider">OR</div>

        <div className="form-footer">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
