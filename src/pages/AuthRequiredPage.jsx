import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import SignupForm from "../components/SignupForm.jsx";
import "./AuthRequiredPage.css";


const AuthRequiredPage = () => {
  const [formType, setFormType] = useState(null); // null, 'signup', or 'login'

  return (
    <div className="auth-required-page">
      <h2 className="auth-required-heading">Account required</h2>

      <p className="auth-required-message">
        You must be logged in to create a fundraiser.
      </p>

      <div className="links">
        <ul>
          <li className="auth-link" onClick={() => setFormType('signup')}>Sign up</li>
          <li className="auth-link" onClick={() => setFormType('login')}>Log in</li>
        </ul>
      </div>

      {formType === 'signup' && (
        <div className="auth-form-section">
          <h3>Sign up</h3>
          <SignupForm />
        </div>
      )}
      {formType === 'login' && (
        <div className="auth-form-section">
          <h3>Log in</h3>
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default AuthRequiredPage;
