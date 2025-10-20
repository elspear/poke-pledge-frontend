import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="login-signup-container">
      <section>
        {showSignup ? <SignupForm /> : <LoginForm />}
        <div className="toggle-section">
          {showSignup ? (
            <>
              <p>Already have an account?</p>
              <button onClick={() => setShowSignup(false)}>Log In</button>
            </>
          ) : (
            <>
              <p>Don't have an account?</p>
              <button onClick={() => setShowSignup(true)}>Sign Up</button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default LoginPage;