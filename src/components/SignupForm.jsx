import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./SharedForm.css";

function SignupForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    fields: {
      email: "",
      password: "",
    },
    errors: {
      email: "",
      password: "",
    }
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    //Email validation
    if (!formState.fields.email) {
      newErrors.email = "Email address is required";
      isValid = false;
    }

    // Password validation
    if (!formState.fields.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setFormState(prev => ({
      ...prev,
      errors: newErrors
    }));
    return isValid;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormState(prev => ({
      fields: {
        ...prev.fields,
        [id]: value,
      },
      errors: {
        ...prev.errors,
        [id]: "", // Clear error when user types
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      // Store credentials in sessionStorage
      sessionStorage.setItem("signupData", JSON.stringify(formState.fields));
      // Navigate to signup completion page
      navigate("/complete-signup");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>SIGNUP</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${formState.errors.email ? "error" : ""}`}>
          <label htmlFor="email">EMAIL</label>
          <input
            type="text"
            id="email"
            placeholder="Enter a valid email address"
            onChange={handleChange}
            value={formState.fields.email}
            disabled={isLoading} 
          />
          {formState.errors.email && (
            <span className="form-error-message">{formState.errors.email}</span>
          )}
        </div>

        <div className={`form-group ${formState.errors.password ? "error" : ""}`}>
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            onChange={handleChange}
            value={formState.fields.password}
            disabled={isLoading}
          />
          {formState.errors.password && (
            <span className="form-error-message">{formState.errors.password}</span>
          )}
        </div>

        <button className="form-btn" type="submit" disabled={isLoading}>
          {isLoading ? "CREATING ACCOUNT..." : "CONTINUE"}
        </button>
        <div className="form-divider">OR</div>

        <div className="form-footer">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
