import { Link } from "react-router-dom";
import "./AuthRequiredPage.css";

const AuthRequiredPage = () => {
  return (
    <div className="auth-required-container">
      <div className="auth-required-page">
        <h2 className="auth-required-heading">Account required</h2>

        <p className="auth-required-message">
          You must be logged in to create a fundraiser.
        </p>

        <div className="links">
          <ul>
            <li>
              <Link to="/signup" className="auth-link">Sign up</Link>
            </li>
            <li>
              <Link to="/login" className="auth-link">Log in</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredPage;
