import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import postSignup from "../api/post-signup";
import postLogin from "../api/post-login";
import { useAuth } from "../hooks/use-auth";
import getCurrentUserByUsername from "../api/get-current-user";
import checkUsername from "../api/check-username";
import ProfilePromptModal from "./ProfileModalPrompt";
import "./SharedForm.css";

function CompleteSignupForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const [profileData, setProfileData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  // Get the email & password data from session storage
  useEffect(() => {
    const signupData = sessionStorage.getItem("signupData");
    if (!signupData) {
      // If not initial signup data, redirect back to signup
      navigate("/signup");
    }
  }, [navigate]);

  const [errors, setErrors] = useState({
    username: "",
    firstName: "",
    lastName: "",
    role: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      firstName: "",
      lastName: "",
      role: "",
    };

    //Username validation
    if (!profileData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    //First name validation
    if (!profileData.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    //Last name validation
    if (!profileData.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    //Role validation
    if (!profileData.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Add a ref for debouncing
  const usernameCheckTimeout = useRef(null);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [id]: value,
    }));

    //Clear errors when user starts typing
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));

    // Check username availability after user stops typing
    if (id === 'username' && value.trim()) {
      // Clear any existing timeout
      if (usernameCheckTimeout.current) {
        clearTimeout(usernameCheckTimeout.current);
      }

      // Set new timeout to check username after 500ms of no typing
      usernameCheckTimeout.current = setTimeout(async () => {
        try {
          const response = await checkUsername(value);
          if (!response.available) {
            setErrors(prev => ({
              ...prev,
              username: "This username is already taken"
            }));
          }
        } catch (error) {
          console.error("Error checking username:", error);
        }
      }, 500);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (validateForm()) {
      setIsLoading(true);

      try {
        // get intial signup data
        const signupData = JSON.parse(sessionStorage.getItem("signupData"));

        // combine both sets of data
        const fullUserData = {
          email: signupData.email,
          password: signupData.password,
          username: profileData.username,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          role: profileData.role,
        };

        // First create the account with all data
        await postSignup(fullUserData);

        // Then login with the credentials
        const loginResponse = await postLogin(
          fullUserData.username,
          fullUserData.password
        );

        // set the token and update auth context
        window.localStorage.setItem("token", `Token ${loginResponse.token}`);

        // Fetch the full user/profile created by the backend (signals created Profile)
        try {
          const user = await getCurrentUserByUsername(fullUserData.username);
          window.localStorage.setItem("user", JSON.stringify(user));
          setAuth({ token: `Token ${loginResponse.token}`, user });
        } catch {
          // Fallback to minimal user so basic UI logic works
          const minimal = { username: fullUserData.username };
          window.localStorage.setItem("user", JSON.stringify(minimal));
          setAuth({ token: `Token ${loginResponse.token}`, user: minimal });
        }

        setSuccessMessage("Account created successfully!");
        setShowProfilePrompt(true);
      } catch (error) {
        // Now we have access to the actual server response!
        if (error.serverData) {
          const serverData = error.serverData;

          // Check for username-specific errors
          if (serverData.username) {
            const usernameError = Array.isArray(serverData.username)
              ? serverData.username[0]
              : serverData.username;
            setErrors({ username: usernameError });
          } else if (serverData.email) {
            const emailError = Array.isArray(serverData.email)
              ? serverData.email[0]
              : serverData.email;
            setErrors({ submit: `Signup failed: ${emailError}` });
          } else if (serverData.detail) {
            // Check if the detail mentions username
            if (serverData.detail.toLowerCase().includes("username")) {
              setErrors({ username: serverData.detail });
            } else {
              setErrors({ submit: `Signup failed: ${serverData.detail}` });
            }
          } else {
            // Handle multiple field errors
            const errorFields = Object.entries(serverData);
            if (errorFields.length === 1 && errorFields[0][0] === "username") {
              setErrors({
                username: Array.isArray(errorFields[0][1])
                  ? errorFields[0][1][0]
                  : errorFields[0][1],
              });
            } else {
              const errorText = errorFields
                .map(
                  ([key, value]) =>
                    `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
                )
                .join(". ");
              setErrors({ submit: `Signup failed: ${errorText}` });
            }
          }
        } else if (
          error.message.toLowerCase().includes("username") &&
          (error.message.toLowerCase().includes("already") ||
            error.message.toLowerCase().includes("exists") ||
            error.message.toLowerCase().includes("taken"))
        ) {
          setErrors({
            username:
              "This username is already taken. Please choose another username.",
          });
        } else if (error.response && error.response.data) {
          // Fallback to response data if serverData isn't available
          const errorData = error.response.data;
          if (typeof errorData === "string") {
            setErrors({ submit: `Signup failed: ${errorData}` });
          } else if (errorData.username) {
            setErrors({
              username: Array.isArray(errorData.username)
                ? errorData.username[0]
                : errorData.username,
            });
          } else if (errorData.detail) {
            setErrors({ submit: `Signup failed: ${errorData.detail}` });
          } else if (errorData.message) {
            setErrors({ submit: `Signup failed: ${errorData.message}` });
          } else {
            const errorText = Object.entries(errorData)
              .map(
                ([key, value]) =>
                  `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
              )
              .join(". ");
            setErrors({ submit: `Signup failed: ${errorText}` });
          }
        } else if (error.response) {
          setErrors({
            submit: `Signup failed: Server responded with status ${error.response.status}`,
          });
        } else if (error.request) {
          setErrors({
            submit: `Signup failed: No response from server. Please check your connection.`,
          });
        } else {
          setErrors({
            submit: `Signup failed: ${
              error.message || "Unknown error occurred"
            }`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

    return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <h1>Just a few more details...</h1>        <div className={`form-group ${errors.username ? "error" : ""}`}>
          <label htmlFor="username">USERNAME</label>
          <input
            type="text"
            id="username"
            placeholder="Choose a username to log in with"
            onChange={handleChange}
            value={profileData.username}
            disabled={isLoading}
          />
          {errors.username && (
            <span className="form-error-message">{errors.username}</span>
          )}
        </div>

        <div className={`form-group ${errors.firstName ? "error" : ""}`}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            placeholder="Your first name"
            onChange={handleChange}
            value={profileData.firstName}
            disabled={isLoading}
          />
          {errors.firstName && (
            <span className="form-error-message">{errors.firstName}</span>
          )}
        </div>

        <div className={`form-group ${errors.lastName ? "error" : ""}`}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            placeholder="Your last name"
            onChange={handleChange}
            value={profileData.lastName}
            disabled={isLoading}
          />
          {errors.lastName && (
            <span className="form-error-message">{errors.lastName}</span>
          )}
        </div>

        <div className={`form-group ${errors.role ? "error" : ""}`}>
          <label htmlFor="role">Role:</label>
          <select id="role" value={profileData.role} onChange={handleChange}>
            <option value="">Select a role</option>
            <option value="trainer">Trainer</option>
            <option value="pokemon_center">Pokemon Center</option>
            <option value="safari_park">Safari Park</option>
          </select>
          {errors.role && (
            <span className="form-error-message">{errors.role}</span>
          )}
        </div>

        {/* User Feedback Messages */}
        {errors.submit && <div className="error">{errors.submit}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        {isLoading && <div className="loading">Creating your account...</div>}

        <button className="form-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Complete Sign Up"}
        </button>
      </div>
    </form>
    {showProfilePrompt && (
      <ProfilePromptModal
        onClose={() => setShowProfilePrompt(false)}
      />
    )}
    </>
  );
}

export default CompleteSignupForm;
