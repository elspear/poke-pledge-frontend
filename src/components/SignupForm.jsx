import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SharedForm.css";

function SignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    //Email validation
    if (!credentials.email) {
      newErrors.email = "Email address is required";
      isValid = false;
    }

    // Password validation
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
      // Store credentials in sessionStorage
      sessionStorage.setItem("signupData", JSON.stringify(credentials));
      // Navigate to signup completion page
      navigate("/complete-signup");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-container">
        <div className="form-header">
          <h1>SIGNUP</h1>
        </div>

        <div className={`form-group ${errors.email ? "error" : ""}`}>
          <label htmlFor="email">EMAIL</label>
          <input
            type="text"
            id="email"
            placeholder="Enter a valid email address"
            onChange={handleChange}
            value={credentials.email}
            disabled={isLoading} 
          />
          {errors.email && (
            <span className="form-error-message">{errors.email}</span>
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
          {isLoading ? "CREATING ACCOUNT..." : "CONTINUE"}
        </button>
        <div className="form-divider">OR</div>

        <div className="form-footer">
          Already have an account? <a href="/login">Log In</a>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
