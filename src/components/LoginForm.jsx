import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import postLogin from "../api/post-login";
import getCurrentUserByUsername from "../api/get-current-user";
import "./SharedForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formState, setFormState] = useState({
    fields: {
      username: "",
      password: "",
    },
    errors: {
      username: "",
      password: "",
      submit: "",
    }
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Check all fields are filled
    Object.entries(formState.fields).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
    });

    setFormState(prev => ({
      ...prev,
      errors: newErrors
    }));

    return isValid;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormState(prev => ({
      ...prev,
      fields: { ...prev.fields, [id]: value },
      errors: { ...prev.errors, [id]: "" }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await postLogin(
          formState.fields.username,
          formState.fields.password
        );

        const token = `Token ${response.token}`;
        window.localStorage.setItem("token", token);

        const user = await getCurrentUserByUsername(formState.fields.username);
        window.localStorage.setItem("user", JSON.stringify(user));
        
        setAuth({ token, user });
        navigate("/");

      } catch (error) {
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            submit: "Invalid username or password"
          }
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>LOGIN</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {Object.entries({
          username: "Enter your username",
          password: "Enter your password"
        }).map(([field, placeholder]) => (
          <div key={field} className={`form-group ${formState.errors[field] ? "error" : ""}`}>
            <label htmlFor={field}>{field.toUpperCase()}</label>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              placeholder={placeholder}
              onChange={handleChange}
              value={formState.fields[field]}
              disabled={isLoading}
            />
            {formState.errors[field] && (
              <span className="form-error-message">{formState.errors[field]}</span>
            )}
          </div>
        ))}

        {formState.errors.submit && (
          <div className="error">{formState.errors.submit}</div>
        )}

        <button className="form-btn" type="submit" disabled={isLoading}>
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>
        
        <div className="form-divider">OR</div>

        <div className="form-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
