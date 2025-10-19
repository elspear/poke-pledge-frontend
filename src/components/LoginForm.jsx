import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postLogin from "../api/post-login";
import { useAuth } from "../hooks/use-auth";

function LoginForm() {
    const navigate = useNavigate();
    const {auth, setAuth} = useAuth();
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
      if (!credentials.username.trim()) {  // trim removes whitespace
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
        setErrors(prev => ({
          ...prev,
          [id]: ""
        }))
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateForm()) {
          setIsLoading(true);
          postLogin(
            credentials.username,
            credentials.password,
          ).then((response) => {
            const token = response.token;
            window.localStorage.setItem("token", `Token ${token}`); //must be bearer token
            window.localStorage.setItem("user", JSON.stringify({ username: credentials.username }));
            setAuth({
              token: `Token ${token}`,
              user: { username: credentials.username }
            });
            navigate("/");
          }).catch(error => {
            setErrors({
              username: "Invalid username or password",
              password: "Invalid username or password",
            });
          }).finally(() => {
            setIsLoading(false);
          });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input 
                    type="text"
                    id="username"
                    placeholder="Enter username"
                    onChange={handleChange}
                    value={credentials.username}
                    className={errors.username ? "error" : ""}
                    disabled={isLoading}
                />
                {errors.username && (
                    <span className="error-message">{errors.username}</span>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={credentials.password}
                    className={errors.password ? "error" : ""}
                    disabled={isLoading}
                />
                {errors.password && (
                    <span className="error-message">{errors.password}</span>
                )}
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}

export default LoginForm;